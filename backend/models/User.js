const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ['patient', 'admin'],
            default: 'patient',
        },
        healthScore: {
            type: Number,
            default: 75,
            min: 0,
            max: 100
        },
        vitals: {
            heartRate: { type: Number, default: 72 },
            bloodPressure: { type: String, default: '120/80' },
            hydration: { type: Number, default: 1.5 }, // Liters
            steps: { type: Number, default: 0 },
            sleep: { type: Number, default: 0 }, // Hours
        },
        vitalsHistory: [{
            heartRate: Number,
            bloodPressure: String,
            date: { type: Date, default: Date.now }
        }],
        preferences: {
            darkMode: { type: Boolean, default: false }
        }
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
