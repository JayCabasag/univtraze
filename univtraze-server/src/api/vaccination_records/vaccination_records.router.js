const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const {
  getVaccinationRecords,
  updateVaccinationRecord,
  addVaccinationRecord,
} = require('./vaccination_records.controller');

router.get('/', getVaccinationRecords);
router.put('/', checkToken, updateVaccinationRecord);
router.post('/', checkToken, addVaccinationRecord);
module.exports = router;
