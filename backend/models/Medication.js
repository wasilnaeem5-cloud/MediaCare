const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a medication name'],
        },
        dosage: {
            type: String,
            required: [true, 'Please add dosage (e.g., 500mg)'],
        },
        time: {
            type: String, // format HH:mm
            required: [true, 'Please add a reminder time'],
        },
        frequency: {
            type: String,
            enum: ['Daily', 'Weekly', 'Twice a day', 'As needed'],
            default: 'Daily',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        instruction: {
            type: String, // e.g., "After meal"
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        adherenceData: [{
            date: { type: String }, // YYYY-MM-DD
            taken: { type: Boolean, default: false },
            takenAt: { type: Date }
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Medication', medicationSchema);
