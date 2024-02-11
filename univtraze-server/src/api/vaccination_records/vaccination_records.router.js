const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const { updateVaccineData, addVaccineData, getVaccinationRecords } = require('./vaccination_records.controller');

router.get('/', getVaccinationRecords);
router.put('/', checkToken, updateVaccineData);
router.post('/', checkToken, addVaccineData);
module.exports = router;
