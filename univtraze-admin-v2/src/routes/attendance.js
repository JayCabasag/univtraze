const express = require("express")
const router = express.Router();
const controller = require("./../controllers/attendance")

router.get("/", async (req, res) => {
    const attendance = await controller.getAttendances();
    return res.render("attendance", { attendance })
})

module.exports = router