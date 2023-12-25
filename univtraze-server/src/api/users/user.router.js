const {
  createUser,
  getUsers,
  login,
  updateUserType,
  addStudentDetails,
  addEmployeeDetails,
  addVisitorDetails,
  updateStudentDocs,
  updateEmployeeDocs,
  updateVisitorDocs,
  getStudentDetailsById,
  getEmployeeDetailsById,
  getVisitorDetailsById,
  getAllUsers,
  getUserDetailsById,
  getUserDetailsByIds,
  sendRecoveryPasswordViaEmail,
  updateUserPassword,
  updateUserPasswordFromRecovery,
  checkRecoveryPasswordAndEmailMatched,
  changePassword,
  deactivateAccount,
  updatePersonalInfo,
} = require('./user.controller');

const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/signup', createUser);
router.post('/signin', login);
router.get('/', checkToken, getUsers);
router.get('/getAllUsers', checkToken, getAllUsers);
router.post('/getUserDetailsById', checkToken, getUserDetailsById);
router.post('/getUserDetailsByIds', checkToken, getUserDetailsByIds);
router.post('/updateUserType', checkToken, updateUserType);
router.post('/addStudentDetails', checkToken, addStudentDetails);
router.post('/addEmployeeDetails', checkToken, addEmployeeDetails);
router.post('/addVisitorDetails', checkToken, addVisitorDetails);
router.post('/updateStudentDocs', checkToken, updateStudentDocs);
router.post('/updateEmployeeDocs', checkToken, updateEmployeeDocs);
router.post('/updateVisitorDocs', checkToken, updateVisitorDocs);
router.post('/student', checkToken, getStudentDetailsById);
router.post('/employee', checkToken, getEmployeeDetailsById);
router.post('/visitor', checkToken, getVisitorDetailsById);
router.post('/sendRecoveryPasswordViaEmail', sendRecoveryPasswordViaEmail);
router.post('/updateUserPasswordFromRecovery', updateUserPasswordFromRecovery);
router.post('/checkRecoveryPasswordAndEmailMatched', checkRecoveryPasswordAndEmailMatched);
router.post('/changePassword', checkToken, changePassword);
router.post('/deactivateAccount', checkToken, deactivateAccount);
router.post('/updatePersonalInfo', checkToken, updatePersonalInfo);

module.exports = router;
