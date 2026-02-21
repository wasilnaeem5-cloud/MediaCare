const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res) => {
    console.log('--- API AUDIT: Signup Started ---');
    console.log('Incoming Payload:', { ...req.body, password: '***' });

    try {
        // 1. Verify DB Connection State
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ FATAL: Database not connected. State:', mongoose.connection.readyState);
            return res.status(503).json({
                message: 'Database connection is currently unavailable.'
            });
        }

        const { name, email, password, phone } = req.body;

        // 2. Validate Fields
        if (!name || !email || !password) {
            console.warn('⚠️ Validation failed: Missing required fields');
            return res.status(400).json({ message: 'Name, Email and Password are required' });
        }

        // 3. Check for existing user
        console.log(`Checking if user ${email} exists in DB: ${mongoose.connection.name}...`);
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.warn(`⚠️ signup aborted: User ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // 4. Create and Save User
        console.log('Writing to MongoDB...');
        const user = new User({
            name,
            email,
            password,
            phone,
        });

        // Use .save() to catch any validation errors specifically
        const savedUser = await user.save();

        console.log('✅ Document saved successfully!');
        console.log('DB Confirmation:', {
            id: savedUser._id,
            collection: User.collection.name,
            database: mongoose.connection.name
        });

        // 5. Respond to Client
        const token = generateToken(savedUser._id);

        return res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
            token: token,
        });

    } catch (error) {
        console.error('❌ API AUDIT ERROR (Signup):', error.message);

        // Handle MongoDB validation errors (like unique constraint)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email address already in use' });
        }

        return res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    console.log('--- API AUDIT: Login Started ---');
    const { email, password } = req.body;

    try {
        // Find user and include password (since it's select: false in schema)
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            console.log(`✅ Login successful: ${email}`);
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.warn(`❌ Login failed: Invalid credentials for ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('❌ API AUDIT ERROR (Login):', error.message);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

// Generate JWT Utility
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    signup,
    login,
};
