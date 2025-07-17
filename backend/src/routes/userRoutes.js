// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Path is relative to routes/
const ClaimHistory = require('../models/ClaimHistory'); // Path is relative to routes/

const generateRandomPoints = () => {
    return Math.floor(Math.random() * 10) + 1;
};

// @route   POST /api/users
// @desc    Add a new user
// @access  Public
router.post('/users', async (req, res) => { // Route is /api/users
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: 'User name is required' });
    }
    try {
        let user = await User.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
        if (user) {
            return res.status(400).json({ msg: 'User with this name already exists.' });
        }
        user = new User({ name: name.trim() });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/users', async (req, res) => { // Route is /api/users
    try {
        const users = await User.find().sort({ totalPoints: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/claim-points/:userId
// @desc    Claim random points for a user and record history
// @access  Public
router.post('/claim-points/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const points = generateRandomPoints();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.totalPoints += points;
        await user.save();

        const claimHistory = new ClaimHistory({
            userId,
            pointsClaimed: points
        });
        await claimHistory.save();

        res.json({
            message: `Claimed ${points} points for ${user.name}!`,
            user: user,
            pointsClaimed: points
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/rankings
// @desc    Get all users with calculated ranks (for leaderboard)
// @access  Public
router.get('/rankings', async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1 });

        let currentRank = 1;
        let previousPoints = -1;

        const rankedUsers = users.map((user, index) => {
            if (user.totalPoints !== previousPoints) {
                currentRank = index + 1;
            }
            previousPoints = user.totalPoints;
            return {
                _id: user._id,
                name: user.name,
                totalPoints: user.totalPoints,
                rank: currentRank
            };
        });

        res.json(rankedUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/claim-history/:userId
// @desc    Get claim history for a specific user
// @access  Public
router.get('/claim-history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const history = await ClaimHistory.find({ userId }).sort({ claimedAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;