const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getUpcomingAppointments,
    getAppointmentHistory,
    cancelAppointment,
    rescheduleAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes below

router.post('/book', bookAppointment);
router.get('/upcoming', getUpcomingAppointments);
router.get('/history', getAppointmentHistory);
router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/reschedule', rescheduleAppointment);

module.exports = router;
