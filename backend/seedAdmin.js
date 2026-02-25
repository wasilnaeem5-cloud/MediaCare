const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Path adjusted for being inside /backend
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: 'admin@medicare.com' });
        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        const admin = new User({
            name: 'MediCare Admin',
            email: 'admin@medicare.com',
            password: 'adminpassword123',
            role: 'admin',
        });

        await admin.save();
        console.log('✅ Admin User Created Successfully!');
        console.log('Login: admin@medicare.com / adminpassword123');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
