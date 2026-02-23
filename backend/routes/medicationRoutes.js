const express = require('express');
const router = express.Router();
const {
    getMedications,
    addMedication,
    logMedication,
    deleteMedication
} = require('../controllers/medicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMedications)
    .post(protect, addMedication);

router.patch('/:id/log', protect, logMedication);
router.delete('/:id', protect, deleteMedication);

module.exports = router;
