const express = require('express');
const router = express.Router();
const { getHealthInsights } = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHealthInsights);

module.exports = router;
