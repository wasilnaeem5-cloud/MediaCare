const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('--- DB Debug: Initialization ---');
        console.log('Attempting to connect to:', process.env.MONGO_URI);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Options
            serverSelectionTimeoutMS: 5000,
        });

        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📡 Host: ${conn.connection.host}`);
        console.log(`📂 Database Name: "${conn.connection.name}"`); // This is critical
        console.log(`⚙️  readyState: ${mongoose.connection.readyState} (1 = Connected)`);

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('PRO TIP: Ensure MongoDB Service is running locally (Error Code: ' + error.code + ')');
        process.exit(1);
    }
};

module.exports = connectDB;
