const { getEmailRecoveryCode, changePasswordViaRecoveryCode } = require('./account_recovery.controller');

const router = require('express').Router();

router.post('/recovery-code', getEmailRecoveryCode);
router.post('/change-password', changePasswordViaRecoveryCode);

module.exports = router;
