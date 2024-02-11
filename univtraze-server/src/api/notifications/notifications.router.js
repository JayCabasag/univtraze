const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const {
  adminNotifications,
  updateAdminNotificationStatus,
  getTotalActiveAdminNotifications,
  getClinicNotifications,
  getTotalActiveClinicNotifications,
  updateClinicNotificationsStatus,
  sendEmergencyReportPrescriptionViaEmail,
  sendSendCommunicableDiseaseReportPrescriptionViaEmail,
  getTotalActiveUserNotifications,
  updateUserNotificationStatus,
  getUnivtrazeDataForLanding,
  getUserNotificationsByUserId,
} = require('./notifications.controller');

router.get('/', checkToken, getUserNotificationsByUserId);
router.post('/getAdminNotifications', checkToken, adminNotifications);
router.post('/updateAdminNotificationStatus', checkToken, updateAdminNotificationStatus);
router.get('/getTotalActiveAdminNotifications', checkToken, getTotalActiveAdminNotifications);
router.post('/getClinicNotifications', checkToken, getClinicNotifications);
router.get('/getTotalActiveClinicNotifications', checkToken, getTotalActiveClinicNotifications);
router.post('/updateClinicNotificationStatus', checkToken, updateClinicNotificationsStatus);
router.post('/sendEmergencyReportPrescription', checkToken, sendEmergencyReportPrescriptionViaEmail);
router.post(
  '/sendCommunicableDiseaseReportPrescription',
  checkToken,
  sendSendCommunicableDiseaseReportPrescriptionViaEmail,
);
router.post('/getTotalActiveUserNotifications', checkToken, getTotalActiveUserNotifications);
router.post('/updateUserNotificationStatus', checkToken, updateUserNotificationStatus);
router.get('/getUnivtrazeDataForLanding', getUnivtrazeDataForLanding);

module.exports = router;
