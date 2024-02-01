const { createEmergencyReport, getEmergencyReportById } = require('./emergency_reports.controller');

const router = require('express').Router();

router.post('/', createEmergencyReport);
router.get('/:emergencyReportId', getEmergencyReportById);

module.exports = router;
