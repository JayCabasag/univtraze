const {createAdmin, loginAdmin, resetAdminPassword, updateAdminPassword, updateAdminCredentials} = require("./admin.controller")
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validator")

router.post("/createAdmin", createAdmin)
router.post("/loginAdmin", loginAdmin)
router.post("/resetAdminPassword", resetAdminPassword)
router.post("/updateAdminPassword", updateAdminPassword)
router.post("/updateAdminCredentials",checkToken, updateAdminCredentials)

module.exports = router;