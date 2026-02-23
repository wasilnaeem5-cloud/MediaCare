const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    updateAppointmentByAdmin,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.patch('/appointments/:id', protect, admin, updateAppointmentByAdmin);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
