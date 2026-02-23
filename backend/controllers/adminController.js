const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');

// @desc    Get dashboard stats for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        const activeMedications = await Medication.countDocuments({ isActive: true });

        // Basic analytics
        const completedApts = await Appointment.countDocuments({ status: 'Completed' });
        const cancelledApts = await Appointment.countDocuments({ status: 'Cancelled' });

        res.json({
            users: totalUsers,
            appointments: totalAppointments,
            medications: activeMedications,
            completionRate: totalAppointments > 0 ? (completedApts / totalAppointments) * 100 : 0,
            cancellationRate: totalAppointments > 0 ? (cancelledApts / totalAppointments) * 100 : 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status (admin only)
// @route   PATCH /api/admin/appointments/:id
const updateAppointmentByAdmin = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = req.body.status || appointment.status;
        appointment.notes = req.body.notes || appointment.notes;

        const updated = await appointment.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete an admin' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    updateAppointmentByAdmin,
    deleteUser
};
