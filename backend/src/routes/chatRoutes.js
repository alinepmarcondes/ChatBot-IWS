// backend/src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Rota para salvar uma nova mensagem no chat
router.post('/', async (req, res) => {
  try {
    const { title, timestamp, sender, message } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { title },
      { $push: { content: { timestamp, sender, message } } },
      { upsert: true, new: true }
    );
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

