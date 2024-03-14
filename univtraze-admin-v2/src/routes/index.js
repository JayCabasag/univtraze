const express = require("express")
const router = express.Router();
const overviewController = require("./../controllers/overview")

router.get("/", async (req, res) => {
    const overview = await overviewController.getOverview();
    return res.render("index", { overview, route: "/"})
})

// API

router.get("/overview/charts/disease-reports", async (req, res) => {
    const diseaseReportsData = await overviewController.getDiseaseReportsData();
    const months = ["Jan", "Feb", "Mar","Apr","May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const monthlyDiseaseReports = Array.from({ length: 12 }, (_, index) => {
        return diseaseReportsData[index]?.count || 0
    })
    return res.status(200).json({
        disease_reports: {
            months,
            reports: monthlyDiseaseReports
        }
    })
})

router.get("/overview/charts/cases", async (req, res) => {
    const cases = await overviewController.getDiseaseReportsStatusTotal();
    return res.status(200).json({
        cases: {
            active_total: cases.active_count || 0,
            resolved_total: cases.resolved_count || 0
        }
    })
})


module.exports = router