const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/courses');

const app = express();
app.use(express.json());

// Use the routes for users and courses
app.use('/users', userRoutes);
app.use('/admin', courseRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
