// routes/user.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { SECRET_KEY } = require('../config');
const router = express.Router();

// Signup route for users
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });

        await user.save();
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
