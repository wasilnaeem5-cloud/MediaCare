const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const path = require('path');
// 1. Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Initial Logging
console.log(`⚡ MediCare Backend | Mode: ${process.env.NODE_ENV || 'production'}`);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'MediCare Startup MVP API is active', status: 'Healthy' });
});

// 5. Start Server Lifecycle
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
            console.log(`📡 Health Check: http://localhost:${PORT}/`);
            console.log('---------------------------------------------');
        });
    } catch (error) {
        console.error('❌ Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();
