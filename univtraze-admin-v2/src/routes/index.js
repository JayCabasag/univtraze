const express = require("express")
const router = express.Router();
const overviewController = require("./../controllers/overview")

router.get("/", async (req, res) => {
    const overview = await overviewController.getOverview();
    console.log(overview)
    return res.render("index", { overview })
})

module.exports = router