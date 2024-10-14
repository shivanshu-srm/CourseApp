// routes/courses.js
const express = require('express');
const bcrypt = require('bcrypt');
const Course = require('../models/course');
const User = require('../models/user'); // Import User model
const { authenticateJWT, isAdmin } = require('./middleware'); // Adjust path as necessary
const router = express.Router();

// Admin signup
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role: 'admin' });

        await user.save();
        res.json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Error creating admin' });
    }
});

// Create a course
router.post('/', authenticateJWT, isAdmin, async (req, res) => {
    const { title, description, price, imageLink } = req.body;
    const course = new Course({ title, description, price, imageLink });

    try {
        await course.save();
        res.json({ message: 'Course created successfully', courseId: course._id });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course' });
    }
});

// Add more course routes as necessary

module.exports = router;
