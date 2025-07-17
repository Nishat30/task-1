// backend/models/User.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const usersToSeed = [
    { name: 'Nishat', totalPoints: 460, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { name: 'Rahul', totalPoints: 90, avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Huma', totalPoints: 34, avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Kabir', totalPoints: 78, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { name: 'Salar', totalPoints: 42, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Zara', totalPoints: 250, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { name: 'Minhaj', totalPoints: 392, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { name: 'Asad', totalPoints: 892, avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { name: 'Raj', totalPoints: 932, avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { name: 'Om', totalPoints: 10, avatar: 'https://randomuser.me/api/portraits/men/7.jpg' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding.');

        for (const userData of usersToSeed) {
            // Check if user exists by name, case-insensitive
            const existingUser = await User.findOne({ name: new RegExp(`^${userData.name.trim()}$`, 'i') });
            if (!existingUser) {
                await User.create(userData);
                console.log(`User '${userData.name}' added with avatar.`);
            } else {
                // If user exists, update their avatar if it's different or missing
                if (existingUser.avatar !== userData.avatar) {
                    await User.updateOne({ _id: existingUser._id }, { $set: { avatar: userData.avatar } });
                    console.log(`User '${userData.name}' already exists. Avatar updated.`);
                } else {
                    console.log(`User '${userData.name}' already exists with the same avatar. Skipping.`);
                }
            }
        }

        console.log('Database seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Database seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
