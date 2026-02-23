const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');

// @desc    Calculate health score and generate logic-based insights
// @route   GET /api/insights
// @access  Private
const getHealthInsights = async (req, res, next) => {
    console.log('[Insight Controller] Starting calculation for user:', req.user?._id);
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            console.warn('[Insight Controller] User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Calculate Medication Adherence Score
        let medScore = 100;
        try {
            const medications = await Medication.find({ userId, isActive: true });
            if (medications.length > 0) {
                let totalPossible = 0;
                let totalTaken = 0;

                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                });

                medications.forEach(med => {
                    totalPossible += 7;
                    if (med.adherenceData && Array.isArray(med.adherenceData)) {
                        totalTaken += med.adherenceData.filter(d => d && last7Days.includes(d.date) && d.taken).length;
                    }
                });
                medScore = totalPossible > 0 ? (totalTaken / totalPossible) * 100 : 100;
            }
        } catch (medErr) {
            console.error('[Insight Controller] Med calc error:', medErr.message);
        }

        // 2. Calculate Appointment Attendance
        let aptScore = 100;
        try {
            const appointments = await Appointment.find({ userId });
            const completed = appointments.filter(a => a.status === 'Completed').length;
            const totalApts = appointments.filter(a => ['Completed', 'Cancelled'].includes(a.status)).length;
            aptScore = totalApts > 0 ? (completed / totalApts) * 100 : 100;
        } catch (aptErr) {
            console.error('[Insight Controller] Apt calc error:', aptErr.message);
        }

        // 3. Dynamic Health Score (weighted)
        const vitalBaseline = (user.vitals && user.vitals.heartRate) ? 80 : 70;
        const currentHealthScore = Math.round((medScore * 0.5) + (aptScore * 0.3) + (vitalBaseline * 0.2));

        console.log('[Insight Controller] New Health Score:', currentHealthScore);

        // Save health score to user
        try {
            user.healthScore = currentHealthScore;
            // Prevent hook issues by only modifying healthScore if possible
            await User.updateOne({ _id: userId }, { $set: { healthScore: currentHealthScore } });
            console.log('[Insight Controller] Health score saved successfully via updateOne');
        } catch (saveErr) {
            console.error('[Insight Controller] User update error:', saveErr.message);
        }

        // 4. Generate Logical Insights
        const insights = [];
        if (medScore < 80) {
            insights.push({
                type: 'Alert',
                title: 'Medication Adherence low',
                message: 'You missed doses this week. Consistency is key for your health.',
                category: 'medication'
            });
        }

        const allApts = await Appointment.find({ userId });
        const historyApts = allApts.filter(a => a.status === 'Completed').sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastCheckup = historyApts[0];

        if (!lastCheckup) {
            insights.push({
                type: 'Warning',
                title: 'No checkup history',
                message: 'Schedule your first checkup to establish a baseline.',
                category: 'checkup'
            });
        }

        console.log('[Insight Controller] Sending response');
        return res.json({
            healthScore: currentHealthScore,
            insights,
            medScore: Math.round(medScore),
            aptScore: Math.round(aptScore)
        });

    } catch (error) {
        console.error('[Insight Controller FATAL Error]:', error.message);
        return res.status(500).json({
            message: 'Error calculating health insights',
            debug: error.message
        });
    }
};

module.exports = { getHealthInsights };
