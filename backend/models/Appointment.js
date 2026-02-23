const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctorName: {
            type: String,
            required: [true, 'Please add a doctor name'],
        },
        doctorSpec: {
            type: String,
            default: 'General Physician'
        },
        doctorAvatar: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'
        },
        date: {
            type: String, // String format YYYY-MM-DD
            required: [true, 'Please add a date'],
        },
        time: {
            type: String,
            required: [true, 'Please add a time'],
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Cancelled', 'Completed', 'Rescheduled'],
            default: 'Scheduled',
        },
        type: {
            type: String,
            enum: ['Consultation', 'Follow-up', 'Routine Checkup', 'Emergency'],
            default: 'Consultation'
        },
        notes: {
            type: String
        },
        cancelledAt: {
            type: Date,
        },
        rescheduleHistory: [{
            date: String,
            time: String,
            updatedAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
