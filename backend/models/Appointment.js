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
        date: {
            type: String, // String format YYYY-MM-DD for easier comparison
            required: [true, 'Please add a date'],
        },
        time: {
            type: String,
            required: [true, 'Please add a time'],
        },
        status: {
            type: String,
            enum: ['Booked', 'Cancelled', 'Completed', 'Rescheduled'],
            default: 'Booked',
        },
        cancelledAt: {
            type: Date,
        },
        rescheduledFrom: {
            type: String, // Previous date
        },
        rescheduledTimeFrom: {
            type: String, // Previous time
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
