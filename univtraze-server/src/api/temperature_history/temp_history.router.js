const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');
const { getTempHistory, addTempHistory } = require('./temp_history.controller');

router.post('/', addTempHistory);
router.get('/', getTempHistory);

module.exports = router;
