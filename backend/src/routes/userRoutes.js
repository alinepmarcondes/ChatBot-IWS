// backend-project/src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { login, password } = req.body;
    const newUser = new User({ login, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
