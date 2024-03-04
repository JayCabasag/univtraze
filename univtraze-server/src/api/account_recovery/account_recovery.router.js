const {
  getEmailRecoveryCode,
  changePasswordViaRecoveryCode,
  verifyRecoveryPassword,
} = require('./account_recovery.controller');

const router = require('express').Router();

router.post('/recovery-code', getEmailRecoveryCode);
router.post('/verify', verifyRecoveryPassword);
router.post('/change-password', changePasswordViaRecoveryCode);

module.exports = router;
