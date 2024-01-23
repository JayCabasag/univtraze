const {
  addRoom,
  addVisitedRoom,
  searchRoomNumber,
  userVisitedRooms,
  userTodaysTemperature,
  searchUsersByRoomId,
  getRooms,
} = require('./room.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.get('/', checkToken, getRooms);
router.post('/addRoom', checkToken, addRoom);
router.post('/addVisitedRoom', checkToken, addVisitedRoom);
router.post('/searchUsersByRoomId', checkToken, searchUsersByRoomId);
router.post('/userVisitedRooms', checkToken, userVisitedRooms);
router.post('/userTemperatureHistory', checkToken, userVisitedRooms);
router.post('/userTodaysTemperature', checkToken, userTodaysTemperature);

module.exports = router;
