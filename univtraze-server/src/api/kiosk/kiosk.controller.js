const { getRoomById } = require('../rooms/room.service');
const { getUserById } = require('../users/user.service');
const { addKioskScanSchema } = require('./kiosk.schema');
const { addKioskScan } = require('./kiosk.services');

module.exports = {
  addKioskScan: (req, res) => {
    const { error } = addKioskScanSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Somefiled where empty',
      });
    }

    getRoomById(req.body.room_id, (error, roomResult) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!roomResult) {
        return res.status(404).json({
          message: 'Room not found',
        });
      }

      getUserById(req.body.user_id, (error, userResult) => {
        if (error) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        if (!userResult) {
          return res.status(404).json({
            message: 'User not found',
          });
        }

        addKioskScan(req.body, (error, results) => {
          if (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(200).json({
            results,
            user: userResult,
            room: roomResult,
          });
        });
      });
    });
  },
};
