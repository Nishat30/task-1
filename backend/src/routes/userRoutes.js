const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

const generateRandomPoints = () => {
    return Math.floor(Math.random() * 10) + 1;
};

// @route   POST /api/users
router.post('/users', async (req, res) => {
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

// @route   POST /api/users/:userId/avatar
router.post('/users/:userId/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'No image file uploaded.' });
        }

        let cloudinaryResult;
        try {
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'leaderboard_avatars',
                public_id: `avatar_${userId}`,
                overwrite: true,
                gravity: "face",
                height: 200,
                width: 200,
                crop: "thumb"
            });

            user.avatar = cloudinaryResult.secure_url;
            await user.save();

            res.json({
                msg: 'Avatar uploaded successfully!',
                avatarUrl: user.avatar,
                user: user
            });

        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ msg: 'Failed to upload image to Cloudinary.' });
        } finally {
            if (req.file && req.file.path) {
                await fs.unlink(req.file.path).catch(err => console.error("Error deleting temp file:", err));
            }
        }

    } catch (err) {
        console.error('Server error during avatar update:', err.message);
        if (err.message === 'Error: Images Only!' || err.message.includes('File too large')) {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});


// @route   GET /api/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/claim-points/:userId
router.post('/claim-points/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const points = generateRandomPoints();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Add 5-min cool-down logic here 
        const now = new Date();
        const lastClaimed = user.lastClaimed;
        const twelveHours = 0.1 *60 * 60 * 1000;

        if (lastClaimed && (now - lastClaimed < twelveHours)) {
            const timeLeftMs = twelveHours - (now - lastClaimed);
            const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
            return res.status(400).json({ msg: `You can claim points again in ${minutesLeft} minutes.`, user: user });
        }

        user.totalPoints += points;
        user.lastClaimed = now; 
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
                rank: currentRank,
                avatar: user.avatar // Include avatar
            };
        });

        res.json(rankedUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/claim-history/:userId
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