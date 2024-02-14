const router = require('express').Router();
const { addKioskScan, getKioskUserById } = require('./kiosk.controller');

router.post('/scan', addKioskScan);
router.get('/users/:user_id', getKioskUserById);

module.exports = router;
