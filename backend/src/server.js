// server/src/server.js
require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import your user routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Body parser for JSON requests

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if DB connection fails
    });

// --- API Routes ---
// All routes in userRoutes will be prefixed with /api
app.use('/api', userRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('Leaderboard API is up and running!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});