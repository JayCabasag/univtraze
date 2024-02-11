const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const { addDiseaseCase, getDiseaseCase, getAllDiseaseOverview } = require('./disease_cases.controller');

router.get('/', checkToken, getDiseaseCase);
router.post('/', checkToken, addDiseaseCase);
router.get('/overview', checkToken, getAllDiseaseOverview);

module.exports = router;
