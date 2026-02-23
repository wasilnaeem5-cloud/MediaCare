const Record = require('../models/Record');

// @desc    Get all records for user
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new medical record
// @route   POST /api/records
// @access  Private
const addRecord = async (req, res) => {
    const { title, type, value, unit, date, doctorName, notes } = req.body;

    try {
        const record = await Record.create({
            userId: req.user._id,
            title,
            type,
            value,
            unit,
            date: date || Date.now(),
            doctorName,
            notes
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Private
const getRecordById = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (record && record.userId.toString() === req.user._id.toString()) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete medical record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (record && record.userId.toString() === req.user._id.toString()) {
            await record.deleteOne();
            res.json({ message: 'Record removed successfully' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRecords,
    addRecord,
    getRecordById,
    deleteRecord
};
