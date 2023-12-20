const {notifyUserForCaseReported} = require("./mailer.controller")
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validator")

router.post("/notifyUserForCaseReported", checkToken, notifyUserForCaseReported)


module.exports = router;