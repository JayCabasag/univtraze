const {
  resetAdminPassword,
  updateAdminPassword,
  updateAdminCredentials,
  signUpAdmin,
  signInAdmin,
} = require('./admin.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/signup', signUpAdmin);
router.post('/signin', signInAdmin);
router.post('/resetAdminPassword', resetAdminPassword);
router.post('/updateAdminPassword', updateAdminPassword);
router.post('/updateAdminCredentials', checkToken, updateAdminCredentials);

module.exports = router;
