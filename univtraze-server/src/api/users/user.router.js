const {
  createUser,
  getUsers,
  signin,
  updateUserType,
  addStudentDetails,
  addEmployeeDetails,
  addVisitorDetails,
  getStudentDetailsById,
  getEmployeeDetailsById,
  getVisitorDetailsById,
  getAllUsers,
  getUserDetailsById,
  getUserDetailsByIds,
  sendRecoveryPasswordViaEmail,
  updateUserPasswordFromRecovery,
  checkRecoveryPasswordAndEmailMatched,
  changePassword,
  deactivateAccount,
  updatePersonalInfo,
} = require('./user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/signup', createUser);
router.post('/signin', signin);
router.get('/', checkToken, getUsers);
router.get('/getAllUsers', checkToken, getAllUsers);
router.post('/getUserDetailsById', checkToken, getUserDetailsById);
router.post('/getUserDetailsByIds', checkToken, getUserDetailsByIds);
router.post('/updateUserType', checkToken, updateUserType);
router.post('/student-details', checkToken, addStudentDetails);
router.post('/employee-details', checkToken, addEmployeeDetails);
router.post('/visitor-details', checkToken, addVisitorDetails);
router.get('/student', checkToken, getStudentDetailsById);
router.get('/employee', checkToken, getEmployeeDetailsById);
router.get('/visitor', checkToken, getVisitorDetailsById);
router.post('/sendRecoveryPasswordViaEmail', sendRecoveryPasswordViaEmail);
router.post('/updateUserPasswordFromRecovery', updateUserPasswordFromRecovery);
router.post('/checkRecoveryPasswordAndEmailMatched', checkRecoveryPasswordAndEmailMatched);
router.post('/changePassword', checkToken, changePassword);
router.post('/deactivateAccount', checkToken, deactivateAccount);
router.post('/updatePersonalInfo', checkToken, updatePersonalInfo);

module.exports = router;
