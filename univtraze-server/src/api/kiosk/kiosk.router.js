const router = require('express').Router();
const { addKioskScan } = require('./kiosk.controller');

router.post('/scan', addKioskScan);

module.exports = router;
