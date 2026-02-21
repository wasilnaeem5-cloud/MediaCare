const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('--- DB Debug: Attempting to connect to MongoDB ---');
        console.log('Mongoose readyState (before):', mongoose.connection.readyState);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log('Mongoose readyState (after):', mongoose.connection.readyState);

        return conn;
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.error('PRO TIP: Make sure your local MongoDB service (mongod) is running!');
        process.exit(1);
    }
};

module.exports = connectDB;
