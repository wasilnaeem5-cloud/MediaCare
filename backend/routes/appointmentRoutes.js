const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getAppointments,
    getUpcomingAppointments,
    getAppointmentHistory,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes below

router.post('/book', bookAppointment);
router.get('/', getAppointments);
router.get('/upcoming', getUpcomingAppointments);
router.get('/history', getAppointmentHistory);

module.exports = router;
