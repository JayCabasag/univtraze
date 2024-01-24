const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const { addDiseaseCase, getDiseaseCase } = require('./disease_cases.controller');

router.get('/', checkToken, getDiseaseCase);
router.post('/', checkToken, addDiseaseCase);

module.exports = router;
