const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private
const bookAppointment = async (req, res) => {
    console.log('--- Appointment AUDIT: Booking Started ---');
    const { doctorName, date, time } = req.body;

    try {
        if (!doctorName || !date || !time) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if slot already booked for this doctor (excluding cancelled ones)
        const existingAppointment = await Appointment.findOne({
            doctorName,
            date,
            time,
            status: { $ne: 'Cancelled' }
        });

        if (existingAppointment) {
            console.warn(`⚠️ Slot collision for ${doctorName} on ${date} at ${time}`);
            return res.status(400).json({ message: 'This slot is already booked for this doctor' });
        }

        const appointment = await Appointment.create({
            userId: req.user._id,
            doctorName,
            doctorSpec: req.body.doctorSpec || 'General Physician',
            date,
            time,
            status: 'Scheduled'
        });

        console.log('✅ Appointment Created:', appointment._id);
        res.status(201).json(appointment);
    } catch (error) {
        console.error('❌ Booking Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
const getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await Appointment.find({
            userId: req.user._id,
            date: { $gte: today },
            status: { $ne: 'Cancelled' }
        }).sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get history appointments
// @route   GET /api/appointments/history
// @access  Private
const getAppointmentHistory = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const appointments = await Appointment.find({
            userId: req.user._id,
            $or: [
                { status: 'Cancelled' },
                { date: { $lt: today } },
                { status: 'Completed' }
            ]
        }).sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
    const aptId = req.params.id;
    console.log('--- Appointment AUDIT: Cancellation Attempt ---');
    console.log('Target ID:', aptId);
    console.log('User ID:', req.user._id);

    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(aptId)) {
            console.error('❌ Invalid Appointment ID Format:', aptId);
            return res.status(400).json({ message: 'Invalid appointment ID format' });
        }

        const appointment = await Appointment.findById(aptId);

        if (!appointment) {
            console.error('❌ Appointment NOT FOUND in DB for ID:', aptId);
            // Log all existing appointments for this user to debug
            const allApts = await Appointment.find({ userId: req.user._id });
            console.log('Existing IDs for this user:', allApts.map(a => a._id.toString()));

            return res.status(404).json({ message: 'Appointment not found' });
        }

        console.log('Appointment Found. Owner check...');

        // Ensure user owns the appointment
        if (appointment.userId.toString() !== req.user._id.toString()) {
            console.error('❌ Unauthorized: Owner mismatch');
            return res.status(401).json({ message: 'User not authorized to modify this appointment' });
        }

        if (appointment.status === 'Cancelled') {
            console.warn('⚠️ Already cancelled');
            return res.status(400).json({ message: 'Appointment is already cancelled' });
        }

        appointment.status = 'Cancelled';
        appointment.cancelledAt = Date.now();
        await appointment.save();

        console.log('✅ Appointment Cancelled successfully');
        res.json(appointment);
    } catch (error) {
        console.error('❌ Cancel Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reschedule an appointment
// @route   PATCH /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = async (req, res) => {
    const aptId = req.params.id;
    const { date, time } = req.body;
    console.log('--- Appointment AUDIT: Reschedule Attempt ---');
    console.log('Target ID:', aptId);

    try {
        if (!date || !time) {
            return res.status(400).json({ message: 'Please provide new date and time' });
        }

        if (!mongoose.Types.ObjectId.isValid(aptId)) {
            return res.status(400).json({ message: 'Invalid appointment ID format' });
        }

        const appointment = await Appointment.findById(aptId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure user owns the appointment
        if (appointment.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (appointment.status === 'Cancelled') {
            return res.status(400).json({ message: 'Cannot reschedule a cancelled appointment' });
        }

        // Prevent double booking for the same doctor, date, and time
        const existingAppointment = await Appointment.findOne({
            doctorName: appointment.doctorName,
            date,
            time,
            status: { $ne: 'Cancelled' },
            _id: { $ne: appointment._id }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This slot is already booked' });
        }

        // Save old values
        appointment.rescheduledFrom = appointment.date;
        appointment.rescheduledTimeFrom = appointment.time;

        // Update to new values
        appointment.date = date;
        appointment.time = time;
        appointment.status = 'Rescheduled';

        await appointment.save();

        console.log('✅ Appointment Rescheduled successfully');
        res.json(appointment);
    } catch (error) {
        console.error('❌ Reschedule Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getUpcomingAppointments,
    getAppointmentHistory,
    cancelAppointment,
    rescheduleAppointment,
};
