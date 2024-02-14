const { getRoomById } = require('../rooms/room.service');
const {
  getUserById,
  getStudentDetailsById,
  getVisitorDetailsById,
  getEmployeeDetailsById,
} = require('../users/user.service');
const { addKioskScanSchema, getKioskUserByIdSchema } = require('./kiosk.schema');
const { addKioskScan } = require('./kiosk.service');

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
  getKioskUserById: (req, res) => {
    const { error } = getKioskUserByIdSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        message: 'User id is required',
      });
    }
    const userId = req.params.user_id;

    getUserById(userId, (error, userResult) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      delete userResult.password;
      delete userResult.provider;

      switch (userResult.type) {
        case 'student':
          return getStudentDetailsById(userResult.id, (error, studentDetailsResult) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            if (!studentDetailsResult) {
              return res.status(404).json({
                message: 'Student details not found',
              });
            }

            return res.status(200).json({
              user: { ...userResult },
              details: { ...studentDetailsResult },
            });
          });
        case 'visitor':
          return getVisitorDetailsById(userResult.id, (error, visitorDetailsResult) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            if (!visitorDetailsResult) {
              return res.status(404).json({
                message: 'Visitor details not found',
              });
            }

            return res.status(200).json({
              user: { ...userResult },
              details: { ...visitorDetailsResult },
            });
          });
        case 'employee':
          return getEmployeeDetailsById(userResult.id, (error, employeeDetailsResult) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            if (!employeeDetailsResult) {
              return res.status(404).json({
                message: 'Employee details not found',
              });
            }

            return res.status(200).json({
              user: { ...userResult },
              details: { ...employeeDetailsResult },
            });
          });
        default:
          return res.status(200).json({
            message: 'User not verified',
          });
      }
    });
  },
};
