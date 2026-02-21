const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

console.log('--- Controller Debug: User Model Importing ---');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    console.log('--- API Debug: POST /api/auth/signup hit ---');
    console.log('Request Body:', { ...req.body, password: '***' });
    console.log('Mongoose readyState (at Signup):', mongoose.connection.readyState);

    const { name, email, password, phone } = req.body;

    try {
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ Database not ready! readyState:', mongoose.connection.readyState);
            return res.status(503).json({
                message: 'Database connection is not ready. Please try again in a moment.',
                readyState: mongoose.connection.readyState
            });
        }

        console.log(`Searching for existing user with email: ${email}...`);
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Creating new user...');
        const user = await User.create({
            name,
            email,
            password,
            phone,
        });

        if (user) {
            console.log('✅ User created successfully:', user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('❌ Signup Error:', error.message);
        res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    console.log('--- API Debug: POST /api/auth/login hit ---');
    console.log('Mongoose readyState (at Login):', mongoose.connection.readyState);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            console.log('✅ Login successful for:', email);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('❌ Invalid credentials for:', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('❌ Login Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    signup,
    login,
};
