const {
  addRoom,
  getAllRooms,
  addVisitedRoom,
  searchRoomNumber,
  userVisitedRooms,
  userTodaysTemperature,
  searchUsersByRoomId,
} = require('./room.controller');
const router = require('express').Router();
const { checkToken } = require('../../auth/token_validator');

router.post('/addRoom', checkToken, addRoom);
router.get('/allRooms', checkToken, getAllRooms);
router.post('/addVisitedRoom', checkToken, addVisitedRoom);
router.post('/searchRoom', checkToken, searchRoomNumber);
router.post('/searchUsersByRoomId', checkToken, searchUsersByRoomId);
router.post('/userVisitedRooms', checkToken, userVisitedRooms);
router.post('/userTemperatureHistory', checkToken, userVisitedRooms);
router.post('/userTodaysTemperature', checkToken, userTodaysTemperature);

module.exports = router;
