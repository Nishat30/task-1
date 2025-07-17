const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dtzvourc7h/image/upload/v1234567890/leaderboard_avatars/default_avatar.png'
    },
    lastClaimed: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('User', UserSchema);