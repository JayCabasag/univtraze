const { addVisitedRoom, getRoomVisited } = require('./room_visited.controller');

const router = require('express').Router();

router.post('/', addVisitedRoom);
router.get('/', getRoomVisited);
module.exports = router;
