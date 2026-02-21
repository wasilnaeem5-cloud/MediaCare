const Appointment = require('../models/Appointment');

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private
const bookAppointment = async (req, res) => {
    const { doctorName, date, time } = req.body;

    try {
        if (!doctorName || !date || !time) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if slot already booked for this doctor
        const existingAppointment = await Appointment.findOne({
            doctorName,
            date,
            time,
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This slot is already booked for this doctor' });
        }

        const appointment = await Appointment.create({
            userId: req.user._id,
            doctorName,
            date,
            time,
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
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
            date: { $lt: today },
        }).sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    getUpcomingAppointments,
    getAppointmentHistory,
};
