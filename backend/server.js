const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

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

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  try {
    const { login, password, type } = req.body;
    let usuario;

    if (type === 'admin' || type === 'user') {
      usuario = new User({ login, password, type });
    } else {
      return res.status(400).json({ error: 'type de usuário inválido.' });
    }

    await usuario.save();
    res.status(201).json({ message: 'Usuário salvo com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar o usuário.' });
  }
});

// Rota para obter todos os usuários
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Rota para obter um usuário por ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o usuário.' });
  }
});

// Rota para editar um usuário por ID
app.put('/users/:id', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { login, password },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar o usuário.' });
  }
});

// Rota para deletar um usuário por ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o usuário.' });
  }
});

// Rota para autenticar o usuário
app.post('/users/authenticate', async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login, password });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    res.status(200).json({ message: 'Autenticação bem-sucedida!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao autenticar o usuário.' });
  }
});


// chat ------------------------------

// Rota para obter chats
app.get('/chats', async (req, res) => {
  try {
    const { userId } = req.query;  // Assume que o ID do usuário é passado como parâmetro de consulta
    const chats = await Chat.find({ user: userId });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar chats.' });
  }
});


// Rota para criar um novo chat
app.post('/chats', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const chat = new Chat({ title, content, user: userId });
    await chat.save();
    res.status(201).json({ message: 'Chat criado com sucesso!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o chat.' });
  }
});

// Rota para inserir mensagem em um chat
app.post('/chats/:chatId/content', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat não encontrado.' });
    }
    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      timestamp: String(new Date()),
      sender: 'user',
      message: message
    };
    chat.content.push(newMessage);
    await chat.save();
    res.status(201).json({ message: 'Mensagem adicionada com sucesso!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar mensagem ao chat.' });
  }
});

// Rota para atualizar o título de um chat
app.put('/chats/:chatId/title', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { newTitle } = req.body; // Supondo que você envie o novo título no corpo da requisição
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat não encontrado.' });
    }
    chat.title = newTitle;
    await chat.save();
    res.status(200).json({ message: 'Título do chat atualizado com sucesso!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o título do chat.' });
  }
});


// ----------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
