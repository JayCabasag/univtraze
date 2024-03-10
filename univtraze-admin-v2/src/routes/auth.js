const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/signout", (req, res) => {
    res.render("auth")
})

router.get("/signup", (req, res) => {
    res.render("auth")
})


module.exports = router;