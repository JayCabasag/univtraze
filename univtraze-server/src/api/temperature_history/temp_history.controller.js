const schemas = require('../../utils/helpers/schemas');
const { getRoomById } = require('../rooms/room.service');
const { getUserById } = require('../users/user.service');
const { getAllTempHistory, getTempHistoryByUserId, addTemperatureHistory } = require('./temp_history.service');

module.exports = {
  getTempHistory: (req, res) => {
    const userId = req.query.user_id;

    if (!userId) {
      return getAllTempHistory((err, results) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        return res.status(200).json({
          count: results.length,
          results,
        });
      });
    }

    getTempHistoryByUserId(parseInt(userId), (err, results) => {
      if (err) {
        return res.status(500).message({
          message: 'Internal server error',
        });
      }

      return res.status(200).json({
        count: results.length,
        results,
      });
    });
  },
  addTempHistory: (req, res) => {
    const { error } = schemas.addTempHistorySchema.validate(req.body);
    if (error) {
      return res.status(409).json({
        message: 'Invalid payload',
      });
    }

    getUserById(req.body.user_id, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'User does not exists',
        });
      }

      getRoomById(req.body.room_id, (error, results) => {
        if (error) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        if (!results) {
          return res.status(404).json({
            message: 'Room not found',
          });
        }

        addTemperatureHistory(req.body, (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(500).json({
            results,
          });
        });
      });
    });
  },
};
