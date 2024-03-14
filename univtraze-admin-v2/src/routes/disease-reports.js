const express = require("express")
const router = express.Router();
const controller = require("../controllers/disease-reports")

router.get("/", async (req, res) => {
    const diseaseReports = await controller.getDiseaseReports();
    return res.render("disease-reports", { diseaseReports, route: "/disease-reports" })
})

module.exports = router