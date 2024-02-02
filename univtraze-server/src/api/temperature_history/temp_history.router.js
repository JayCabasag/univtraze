const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const { getTempHistory, addTempHistory } = require('./temp_history.controller');

router.post('/', checkToken, addTempHistory);
router.get('/', checkToken, getTempHistory);

module.exports = router;
