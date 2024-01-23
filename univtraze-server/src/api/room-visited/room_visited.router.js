const { addVisitedRoom } = require('./room_visited.controller');

const router = require('express').Router();

router.post('/', addVisitedRoom);
module.exports = router;
