const router = require("express").Router();
const { checkToken } = require("../../auth/token_validator");
const { addCovidPositive, addEmergencyReport, addDailyAssessment, searchEmergencyReportsViaDate, 
    addCommunicableDiseaseCase, getAllEmergencyReports, getAllEmergencyReportsResolved,
     getAllEmergencyReportsByStatus, updateEmergencyReportCaseStatus, deleteEmergencyReportCase, 
     getAllEmergencyReportsByVictimName, getAllEmergencyReported} = require("./covid_case.controller");

router.get("/getAllEmergencyReported", checkToken, getAllEmergencyReported)
router.get("/addCovidPositive", checkToken, addCovidPositive)
router.post("/addEmergencyReport", checkToken, addEmergencyReport)
router.post("/addDailyAssessment", checkToken, addDailyAssessment)
router.post("/searchEmergencyReportsViaDate", checkToken, searchEmergencyReportsViaDate)
router.post("/addCommunicableDiseaseCase", checkToken, addCommunicableDiseaseCase)
router.get("/getAllEmergencyReports", checkToken, getAllEmergencyReports)
router.get("/getAllEmergencyReportsResolved", checkToken, getAllEmergencyReportsResolved)
router.post("/getAllEmergencyReportsByStatus", checkToken, getAllEmergencyReportsByStatus)
router.post("/getAllEmergencyReportsByVictimName", checkToken, getAllEmergencyReportsByVictimName)
router.post("/updateEmergencyReportCaseStatus", checkToken, updateEmergencyReportCaseStatus)
router.post("/deleteEmergencyReportCase", checkToken, deleteEmergencyReportCase)

module.exports = router;