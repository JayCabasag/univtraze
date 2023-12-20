const router = require("express").Router()
const { checkToken } = require("../../auth/token_validator");
const { adminNotifications, updateAdminNotificationStatus, getTotalActiveAdminNotifications, getClinicNotifications, getTotalActiveClinicNotifications,
     updateClinicNotificationsStatus, sendEmergencyReportPrescriptionViaEmail, sendSendCommunicableDiseaseReportPrescriptionViaEmail,  getUserNotificationsById,
     getTotalActiveUserNotifications,  updateUserNotificationStatus, getUnivtrazeDataForLanding} = require("./notifications.controller");

router.post("/getAdminNotifications", checkToken, adminNotifications)
router.post("/updateAdminNotificationStatus", checkToken, updateAdminNotificationStatus)
router.get("/getTotalActiveAdminNotifications", checkToken, getTotalActiveAdminNotifications)
router.post("/getClinicNotifications", checkToken, getClinicNotifications)
router.get("/getTotalActiveClinicNotifications", checkToken, getTotalActiveClinicNotifications)
router.post("/updateClinicNotificationStatus", checkToken, updateClinicNotificationsStatus)
router.post("/sendEmergencyReportPrescription", checkToken, sendEmergencyReportPrescriptionViaEmail)
router.post("/sendCommunicableDiseaseReportPrescription", checkToken, sendSendCommunicableDiseaseReportPrescriptionViaEmail)
router.post("/getUserNotificationsById", checkToken,  getUserNotificationsById)
router.post("/getTotalActiveUserNotifications", checkToken, getTotalActiveUserNotifications)
router.post("/updateUserNotificationStatus", checkToken,  updateUserNotificationStatus)
router.get("/getUnivtrazeDataForLanding",  getUnivtrazeDataForLanding)


module.exports = router;