const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a record title'],
        },
        type: {
            type: String,
            required: [true, 'Please add a record type'],
            enum: ['Blood Test', 'Radiology', 'Clinical', 'Pharmacy', 'Other'],
            default: 'Clinical'
        },
        value: {
            type: String, // e.g. "120/80", "5.6 mmol/L"
        },
        unit: {
            type: String, // e.g. "mmHg", "mg/dL"
        },
        date: {
            type: Date,
            default: Date.now,
        },
        doctorName: {
            type: String,
        },
        notes: {
            type: String,
        },
        attachmentUrl: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Record', recordSchema);
