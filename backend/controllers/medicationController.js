const Medication = require('../models/Medication');
const User = require('../models/User');

// @desc    Get all active medications for user
// @route   GET /api/medications
// @access  Private
const getMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ userId: req.user._id, isActive: true });
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new medication
// @route   POST /api/medications
// @access  Private
const addMedication = async (req, res) => {
    const { name, dosage, time, frequency, instruction, endDate } = req.body;

    try {
        const medication = await Medication.create({
            userId: req.user._id,
            name,
            dosage,
            time,
            frequency,
            instruction,
            endDate
        });

        res.status(201).json(medication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Log medication as taken
// @route   PATCH /api/medications/:id/log
// @access  Private
const logMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication || medication.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        const today = new Date().toISOString().split('T')[0];

        // Prevent double logging for same day if frequency is daily
        const alreadyTaken = medication.adherenceData.find(d => d.date === today && d.taken);
        if (alreadyTaken && medication.frequency === 'Daily') {
            return res.status(400).json({ message: 'Already logged for today' });
        }

        medication.adherenceData.push({
            date: today,
            taken: true,
            takenAt: Date.now()
        });

        await medication.save();
        res.json(medication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Deactivate medication
// @route   DELETE /api/medications/:id
// @access  Private
const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication || medication.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        medication.isActive = false;
        await medication.save();
        res.json({ message: 'Medication removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMedications,
    addMedication,
    logMedication,
    deleteMedication
};
