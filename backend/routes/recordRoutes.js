const express = require('express');
const router = express.Router();
const {
    getRecords,
    addRecord,
    getRecordById,
    deleteRecord
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getRecords)
    .post(protect, addRecord);

router.route('/:id')
    .get(protect, getRecordById)
    .delete(protect, deleteRecord);

module.exports = router;
