const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('--- Auth Middleware: Checking token... ---');
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'undefined' || token === 'null' || token === 'mock-jwt-token') {
                console.warn('⚠️ Invalid or mock token received');
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded Token ID:', decoded.id);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error('❌ User not found in database');
                return res.status(401).json({ message: 'User not found' });
            }

            console.log('✅ Auth successful for:', req.user.email);
            next();
        } catch (error) {
            console.error('❌ Token Verification Failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.warn('⚠️ No Bearer token found in headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
