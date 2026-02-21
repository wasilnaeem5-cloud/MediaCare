const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Debug logs for startup
console.log('--- Server Debug: Initialization Starting ---');
console.log('Environment:', process.env.NODE_ENV);
console.log('Mongo URI:', process.env.MONGO_URI ? 'Defined' : 'UNDEFINED');

// 3. Disable mongoose buffering (as requested for debugging)
// This will make queries fail immediately if not connected instead of waiting
mongoose.set('bufferCommands', false);
console.log('Mongoose buffering disabled (bufferCommands: false)');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 4. Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

app.get('/', (req, res) => {
    res.send('MediCare API is running...');
});

// 5. START SERVER FUNCTION
const startServer = async () => {
    try {
        console.log('--- Server Debug: Waiting for DB connection... ---');

        // Ensure DB is connected BEFORE starting the listener
        await connectDB();

        console.log('Mongoose readyState (at Server Start):', mongoose.connection.readyState);
        // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
            console.log('---------------------------------------------');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
