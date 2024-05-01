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
    enum: ['admin', 'user'], // type de usuário pode ser 'admin' ou 'regular'
    default: 'user' // Valor padrão é 'regular'
  }
});

const messageContentSchema = new mongoose.Schema({
  timestamp: {
    type: String,
  },
  sender: {
    type: String,
    enum: ['user', 'bot'] // O remetente pode ser 'user' ou 'bot'
  },
  message: {
    type: String,
  }
});

const chatSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: [messageContentSchema]
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

// chat ------------------------------


// Rota para criar um novo chat
app.post('/chats', async (req, res) => {
  try {
    const { title, content } = req.body;
    const chat = new Chat({ title, content });
    await chat.save();
    res.status(201).json({ message: 'Chat criado com sucesso!', chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o chat.' });
  }
});

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

// ----------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

