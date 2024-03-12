const express = require("express")
const router = express.Router();
const controller = require("../controllers/emergency-reports")

router.get("/", async (req, res) => {
    const emergencyReports = await controller.getEmergencyReports();
    return res.render("emergency-reports", { emergencyReports })
})

module.exports = router