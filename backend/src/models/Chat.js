// backend/src/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  timestamp: String,
  sender: String,
  message: String
});

const chatSchema = new mongoose.Schema({
  title: String,
  content: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;