const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
    return res.render("auth/login")
})

router.get("/forgot-password", (req, res) => {
    return res.render("auth/forgot-password")
})

router.get("/signout", (req, res) => {
    return res.render("auth")
})

router.get("/signup", (req, res) => {
    return res.render("auth", { route: "/auth"})
})


module.exports = router;