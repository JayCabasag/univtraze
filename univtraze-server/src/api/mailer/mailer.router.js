const { notifyUserForCaseReported, sendUserRecoveryPassword } = require('./mailer.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/notifyUserForCaseReported', checkToken, notifyUserForCaseReported);
router.post('/recovery-password', checkToken, sendUserRecoveryPassword);

module.exports = router;
