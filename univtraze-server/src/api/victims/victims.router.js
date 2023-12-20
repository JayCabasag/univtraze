const router = require("express").Router();
const { checkToken } = require("../../auth/token_validator");
const {getFirstDegreeVictims, getSecondDegreeVictims, getThirdDegreeVictims} = require("./victims.controller");

router.post("/getFirstDegreeVictims",checkToken, getFirstDegreeVictims)
router.post("/getSecondDegreeVictims",checkToken, getSecondDegreeVictims)
router.post("/getThirdDegreeVictims",checkToken, getThirdDegreeVictims)


module.exports = router;