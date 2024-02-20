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
  deactivateAccount,
  updatePersonalInfo,
  verifyUser,
  updateUserProfileInformation,
  changeUserPassword,
} = require('./user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/signup', createUser);
router.post('/signin', signin);
router.get('/verify', checkToken, verifyUser);
router.get('/', checkToken, getUsers);
router.get('/getAllUsers', checkToken, getAllUsers);
router.get('/:userId', checkToken, getUserDetailsById);
router.post('/getUserDetailsByIds', checkToken, getUserDetailsByIds);
router.put('/user-type', checkToken, updateUserType);
router.post('/student-details', checkToken, addStudentDetails);
router.post('/employee-details', checkToken, addEmployeeDetails);
router.post('/visitor-details', checkToken, addVisitorDetails);
router.get('/student', checkToken, getStudentDetailsById);
router.get('/employee', checkToken, getEmployeeDetailsById);
router.get('/visitor', checkToken, getVisitorDetailsById);
router.post('/sendRecoveryPasswordViaEmail', sendRecoveryPasswordViaEmail);
router.post('/updateUserPasswordFromRecovery', updateUserPasswordFromRecovery);
router.post('/checkRecoveryPasswordAndEmailMatched', checkRecoveryPasswordAndEmailMatched);
// DEACTIVATE should have been DELETE verb but we need body so I use POST
router.post('/:userId/deactivate', checkToken, deactivateAccount);
router.post('/updatePersonalInfo', checkToken, updatePersonalInfo);
router.put('/profile-information', checkToken, updateUserProfileInformation);
router.put('/change-password', checkToken, changeUserPassword);

module.exports = router;
