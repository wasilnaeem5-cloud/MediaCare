const mongoose = require('mongoose');
const dns = require('dns');

/**
 * MongoDB Atlas Connection Configuration
 * 
 * Features:
 * - ISP DNS Fallback (8.8.8.8)
 * - Safe Production Options (Timeout, IPv4)
 * - Disable Buffering (Fast failure detection)
 * - Detailed Logging
 */

// ISP DNS Fallback handling for MongoDB Atlas SRV connection
// This helps resolve issues where some ISPs block DNS SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        console.log('--- DB Connection: Initializing ---');

        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in .env file');
        }

        // Mask URI for safe logging (removes credentials)
        const maskedURI = mongoURI.replace(/\/\/.*@/, '//****:****@');
        console.log('Attempting to connect to Atlas:', maskedURI);

        // Production-ready connection options
        const connectionOptions = {
            autoIndex: true,         // Build indexes (suitable for startup phase)
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
            socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
            family: 4,               // Force IPv4 for better compatibility
        };

        // Ensure the app does NOT rely on mongoose buffering
        // This ensures queries fail immediately if the connection is lost
        mongoose.set('bufferCommands', false);

        const conn = await mongoose.connect(mongoURI, connectionOptions);

        console.log('---------------------------------------------');
        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log(`📡 Host: ${conn.connection.host}`);
        console.log(`📂 Database: "${conn.connection.name}"`);
        console.log(`⚙️  Status: Connected (readyState: ${mongoose.connection.readyState})`);
        console.log('---------------------------------------------');

        // Post-connection event listeners
        mongoose.connection.on('error', (err) => {
            console.error(`❌ Post-connection MongoDB Error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
        });

        return conn;
    } catch (error) {
        console.error('---------------------------------------------');
        console.error('❌ CRITICAL: MongoDB Connection Failed');
        console.error(`Reason: ${error.message}`);

        if (error.code === 'ENOTFOUND' || error.name === 'MongooseServerSelectionError') {
            console.error('💡 PRO TIP: Check your .env MONGO_URI, Whitelist IP in Atlas, or ISP DNS restrictions.');
        }
        console.error('---------------------------------------------');

        // Critical for production: Exit process if DB connection fails
        process.exit(1);
    }
};

module.exports = connectDB;

