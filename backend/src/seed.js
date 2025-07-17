// server/src/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Path is relative to src/

const usersToSeed = [
    { name: 'Pritesh', totalPoints: 1614546 },
    { name: 'Rimjhim Rawat', totalPoints: 1134590 },
    { name: 'Krishu Rajput', totalPoints: 942034 },
    { name: 'Thakur Ran Vijay Singh', totalPoints: 558378 },
    { name: 'Mukku', totalPoints: 503042 },
    { name: 'UWD', totalPoints: 352250 },
    { name: 'Caprin', totalPoints: 346392 },
    { name: 'Mr Rajput', totalPoints: 343892 },
    { name: 'Ishu', totalPoints: 321932 },
    { name: 'Devil', totalPoints: 0 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding.');

        // Optional: await User.deleteMany({});
        // console.log('Existing users cleared.');

        for (const userData of usersToSeed) {
            const existingUser = await User.findOne({ name: new RegExp(`^${userData.name.trim()}$`, 'i') });
            if (!existingUser) {
                await User.create(userData);
                console.log(`User '${userData.name}' added.`);
            } else {
                console.log(`User '${userData.name}' already exists. Skipping.`);
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