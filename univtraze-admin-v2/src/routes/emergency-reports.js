const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("emergency-reports")
})

module.exports = router