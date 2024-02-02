const schemas = require('../../utils/helpers/schemas');
const { getRoomById } = require('../rooms/room.service');
const { getUserById } = require('../users/user.service');
const { addVisitedRoom, getVisitedRoomById, getVisitedRoomsByUserId, getVisitedRoomsByRoomId, getAllVisitedRooms } = require('./room_visited.service');

module.exports = {
  addVisitedRoom: (req, res) => {
    const { error } = schemas.addVisitedRoomSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
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

        addVisitedRoom(req.body, (error, results) => {
          if (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }

          getVisitedRoomById(results.insertId, (error, results) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            if (!results) {
              return res.status(403).json({
                message: 'Visited room does not exists',
              });
            }

            delete userResult.password;
            delete userResult.provider;
            return res.status(200).json({
              user: userResult,
              room: roomResult,
              room_visited: results,
            });
          });
        });
      });
    });
  },
  getRoomVisited: (req, res) => {
    const userId = req.query.user_id;
    const roomId = req.query.room_id;

    if (userId) {
      return getVisitedRoomsByUserId(userId, (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Internal server error"
          })
        }
        return res.status(200).json({
          count: results.length,
          results
        })
      })
    }

    if (roomId) {
      return getVisitedRoomsByRoomId(roomId, (error, results) => {
        if (error) {
          return res.status(500).json({
            message: "Internal server error"
          })
        }

        return res.status(200).json({
          count: results.length,
          results
        })
      })
    }

    getAllVisitedRooms((error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }

      res.status(200).json({
        count: results.length,
        results
      })
    })
  }
};
