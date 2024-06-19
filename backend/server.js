// File: server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const np = require('numpy');
const { Client, Settings } = require('chroma-js');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/C317', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const messageContentSchema = new mongoose.Schema({
  timestamp: { type: String },
  sender: { type: String, enum: ['user', 'bot'] },
  message: { type: String },
});

const chatSchema = new mongoose.Schema({
  title: { type: String },
  content: [messageContentSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Chat = mongoose.model('Chat', chatSchema);
const User = mongoose.model('User', userSchema);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Load embeddings
const npyPath = './embeddings.npy';
const jsonPath = './embeddings.json';

// Load embeddings from npy file
const embeddingsArray = np.load(npyPath);

// Load metadata from json file
const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Combine embeddings and metadata into a list of dictionaries
const embeddings = embeddingsArray.map((embedding, idx) => ({
  embedding: Array.from(embedding),  // Convert numpy array to list
  id: metadata[idx].id,
  metadata: metadata[idx].metadata,
}));

// Initialize Chroma and insert embeddings
const initializeChromaAndInsertEmbeddings = async () => {
  const settings = new Settings();
  const client = new Client({ settings });
  const collection = await client.createCollection('iws_sistemas', { getOrCreate: true });

  for (const record of embeddings) {
    await collection.add({
      embeddings: [record.embedding],
      ids: [record.id],
      metadatas: [record.metadata],
    });
  }

  return collection;
};

// Initialize Chroma collection
const chromaCollection = initializeChromaAndInsertEmbeddings();

// Query Chroma collection
const queryChromaCollection = async (collection, queryEmbedding, topK = 5) => {
  const results = await collection.query({
    query_embeddings: [queryEmbedding],
    n_results: topK,
  });
  return results;
};

// Function to get text embeddings
const get_text_embeddings = async (text, modelIdentifier, serverUrl = 'http://localhost:1234') => {
  const endpoint = `${serverUrl}/v1/embeddings`;
  const headers = { "Content-Type": "application/json" };
  const payload = { input: text, model: modelIdentifier };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();
    return data.data[0].embedding;
  } else {
    console.error(`Error: ${response.status}, ${response.statusText}`);
    return null;
  }
};

// Route to generate response
app.post('/api/generate-response', async (req, res) => {
  const { question } = req.body;
  const modelIdentifier = 'your-model-identifier'; // Replace with your actual model identifier

  try {
    const questionEmbedding = await get_text_embeddings(question, modelIdentifier);

    if (!questionEmbedding) {
      return res.status(500).json({ error: 'Failed to generate embeddings' });
    }

    const collection = await chromaCollection;

    const results = await queryChromaCollection(collection, questionEmbedding);
    const context = results.metadatas[0]
      .map(metadata => metadata.content || '')
      .join('\n')
      .replace(/\n\n/g, '\n')
      .replace(/=/g, '');

    const prompt = `Responda à pergunta com base apenas no seguinte contexto:
    ${context}

    Questão: ${question}
    `;

    const client = new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: "lm-studio" });
    const completion = await client.chat.completions.create({
      model: "mlabonne/gemma-7b-it-GGUF",
      messages: [
        { role: "system", content: `Responda à pergunta com base apenas no seguinte contexto, quando houver instrução, informe a instrução: ${context}` },
        { role: "user", content: `Pergunta: ${question}` }
      ],
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0].message;
    res.json({ response: responseMessage });

  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Error generating response' });
  }
});

// User routes
app.post('/users', async (req, res) => {
  try {
    const { login, password, type } = req.body;
    let usuario;

    if (type === 'admin' || type === 'user') {
      usuario = new User({ login, password, type });
    } else {
      return res.status(400).json({ error: 'Invalid user type.' });
    }

    await usuario.save();
    res.status(201).json({ message: 'User saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving user.' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user.' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { login, password },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user.' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user.' });
  }
});

app.post('/users/authenticate', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Authentication successful!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error authenticating user.' });
  }
});

// Chat routes
app.get('/chats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const chats = await Chat.find({ user: userId });
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Error fetching chats.' });
  }
});

app.post('/chats', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const chat = new Chat({ title, content, user: userId });
    await chat.save();
    res.status(201).json({ message: 'Chat created successfully!', chat });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Error creating chat.' });
  }
});

app.post('/chats/:chatId/content', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }
    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      timestamp: String(new Date()),
      sender: 'user',
      message: message
    };
    chat.content.push(newMessage);
    await chat.save();
    res.status(201).json({ message: 'Message added successfully!', chat });
  } catch (error) {
    console.error('Error adding message to chat:', error);
    res.status(500).json({ error: 'Error adding message to chat.' });
  }
});

app.put('/chats/:chatId/title', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { newTitle } = req.body;
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }
    chat.title = newTitle;
    await chat.save();
    res.status(200).json({ message: 'Chat title updated successfully!', chat });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ error: 'Error updating chat title.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
