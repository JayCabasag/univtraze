const { getEmailRecoveryCode, changePasswordViaRecoveryCode } = require('./account_recovery.controller');

const router = require('express').Router();

router.get('/recovery-code', getEmailRecoveryCode);
router.post('/change-password', changePasswordViaRecoveryCode);

module.exports = router;
