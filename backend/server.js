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
console.log('--- MediCare Backend: Audit Mode ---');
console.log('Environment:', process.env.NODE_ENV || 'production');

// 3. Disable mongoose buffering
// This ensures that queries fail if the database isn't connected yet,
// preventing "hanging" behavior.
mongoose.set('bufferCommands', false);

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

        // Audit check after connection
        console.log('--- POST-CONNECTION AUDIT ---');
        console.log('Active DB Name:', mongoose.connection.name);
        console.log('Ready State:', mongoose.connection.readyState);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log('---------------------------------------------');
            console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
            console.log(`📡 URL: http://localhost:${PORT}`);
            console.log(`📂 DB: ${mongoose.connection.name}`);
            console.log('---------------------------------------------');
        });
    } catch (error) {
        console.error('❌ Server failed to start due to database issues.');
        console.error('Stack Trace:', error.stack);
        process.exit(1);
    }
};

startServer();
