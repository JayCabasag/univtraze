const router = require("express").Router();
const { createClinicAdmin, loginClinicAdmin, getAllTotalCases, updateClinicPassword, clinicForgotPassword, changeClinicPassword} = require("./clinicAdmin.controller");
const { checkToken } = require("../../auth/token_validator");


router.post("/createClinicAdmin", createClinicAdmin)
router.post("/loginClinicAdmin", loginClinicAdmin)
router.get("/getAllTotalCases",checkToken, getAllTotalCases)
router.post("/resetClinicPassword",checkToken, changeClinicPassword)
router.post("/clinicForgotPassword", clinicForgotPassword)
router.post("/updateClinicPassword", updateClinicPassword)
module.exports = router;