const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios'); // Use axios for HTTP requests

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/C317', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user' 
  }
});

const messageContentSchema = new mongoose.Schema({
  timestamp: {
    type: String,
  },
  sender: {
    type: String,
    enum: ['user', 'bot'] 
  },
  message: {
    type: String,
  },
  embedding: {
    type: [Number], // This field will store the embedding array
  }
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: [messageContentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Chat = mongoose.model('Chat', chatSchema);
const User = mongoose.model('User', userSchema);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// users -------------------------------------------

// Route to create a new user
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

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

// Route to get a user by ID
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

// Route to edit a user by ID
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

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ message: 'User successfully deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user.' });
  }
});

// Route to authenticate the user
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

// chat ------------------------------

// Route to get chats
app.get('/chats', async (req, res) => {
  try {
    const { userId } = req.query;  // Assume the user ID is passed as a query parameter
    const chats = await Chat.find({ user: userId });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching chats.' });
  }
});

// Route to create a new chat
app.post('/chats', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const chat = new Chat({ title, content, user: userId });
    await chat.save();
    res.status(201).json({ message: 'Chat successfully created!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating chat.' });
  }
});

// Route to add a message to a chat
app.post('/chats/:chatId/content', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Missing chatId or message in request body.' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    const newMessage = {
      timestamp: new Date(),
      sender: 'user',
      message: message
    };

    chat.content.push(newMessage);

    const botResponse = await getBotResponse(message);

    const botMessage = {
      timestamp: new Date(),
      sender: 'bot',
      message: botResponse.message,  // Usando a resposta em string do modelo
      embedding: botResponse.embedding
    };

    chat.content.push(botMessage);

    await chat.save();

    res.status(201).json({ message: 'Message successfully added to chat!', chat });
  } catch (error) {
    console.error('Error adding message to chat:', error);
    res.status(500).json({ error: 'Error adding message to chat.' });
  }
});

async function getBotResponse(text, model = "NikolayKozloff/Llama-3-portuguese-Tom-cat-8b-instruct-Q6_K-GGUF") {
  try {
    // Chama o endpoint de completions para obter a resposta do modelo
    const completionResponse = await axios.post('http://localhost:1234/v1/chat/completions', {
      messages: [{ role: "user", content: text }],
      model: model
    });

    const message = completionResponse.data.choices[0].message.content;

    // Chama o endpoint de embeddings para obter os embeddings do texto
    const embeddingResponse = await axios.post('http://localhost:1234/v1/embeddings', {
      input: [text],
      model: model
    });

    const embedding = embeddingResponse.data.data[0].embedding;

    return {
      message: message,
      embedding: embedding
    };

  } catch (error) {
    console.error('Error generating bot response:', error);
    return { message: "Error generating response.", embedding: [] };
  }
}

// Route to update the title of a chat
app.put('/chats/:chatId/title', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { newTitle } = req.body; // Assuming you send the new title in the request body
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }
    chat.title = newTitle;
    await chat.save();
    res.status(200).json({ message: 'Chat title successfully updated!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating chat title.' });
  }
});

// ----------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
``