const schemas = require('../../utils/helpers/schemas');
const { getUserById } = require('../users/user.service');
const {
  addRoom,
  getAllRooms,
  addVisitedRoom,
  checkIfRoomExists,
  searchRoomNumber,
  userVisitedRooms,
  userTodaysTemperature,
  searchUsersByRoomId,
  searchRoomsViaDateAndId,
  getEmployeeDetailsById,
  getStudentDetailsById,
  getVisitorDetailsById,
  addRoomVisitedNotificationToUser,
  getRoomById,
  getRooms,
  getTotalRoomCount,
} = require('./room.service');

module.exports = {
  addRoom: (req, res) => {
    const { error } = schemas.addRoomShema.validate(req.body)
    if (error) {
      return res.status(500).json({
        message: "Invalid payload"
      })
    }
    body = req.body;
    checkIfRoomExists(body, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      if (results.length > 0) {
        return res.status(403).json({
          message: 'Room already Exist',
        });
      }

      addRoom(body, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal server error",
          });
        }

        getRoomById(results.insertId, (error, results) => {
          if (error) {
            return res.status(500).json({
              message: "Internal server error"
            })
          }

          if (!results) {
            return res.status(404).json({
              message: "Room not found"
            })
          }

          return res.status(200).json({
            room: results,
          });
        })
      });
    });
  },
  getRooms: (req, res) => {
    const { search } = req.query
    if (!search) {
      return getRooms(async (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal server error",
          });
        }
  
        getTotalRoomCount((error, countResult) => {
          if (error) {
            return res.status(500).json({
              message: "Internal server error"
            })
          }
  
          return res.status(200).json({
            total_rooms: countResult,
            results,
          });
  
        })
      });
    }

    if (isNaN(search)) {
      return res.status(400).json({
        message: "Can only search Room Number"
      })
    }

    searchRoomNumber(parseInt(search), (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }

      return res.status(200).json({
        total_rooms: results.length,
        results,
      });
    })
  },

  addVisitedRoom: (req, res) => {
    body = req.body;

    addVisitedRoom(body, async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Internal server error",
        });
      }

      //Add notification to user

      await new Promise((resolve, reject) => {
        addRoomVisitedNotificationToUser(
          {
            notification_title: 'Room visited',
            notification_description: 'You visited room id : ' + body.room_id,
            notification_source: 'room_visits',
            notification_type: 'room_visits',
            notification_is_viewed: 0,
            notification_for: body.user_id,
          },
          (err, results) => {
            if (err) {
              return reject('Failed adding notification: ' + err.message);
            }

            return resolve('Successfully added Notification');
          },
        );
      });

      return res.status(200).json({
        success: 1,
        message: 'Room visited Sucessfully',
        data: results,
      });
    });
  },

  searchRoomNumber: (req, res) => {
    const body = req.body;

    searchRoomNumber(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Internal server error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  userVisitedRooms: (req, res) => {
    const body = req.body;

    userVisitedRooms(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Internal server error",
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  userTodaysTemperature: (req, res) => {
    const body = req.body;

    userTodaysTemperature(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Internal server error",
        });
      }

      if (results.length === 0) {
        return res.status(200).json({
          success: 0,
          data: 'Not set',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results[0],
      });
    });
  },

  searchUsersByRoomId: async (req, res) => {
    const body = req.body;

    var start_date = new Date();
    start_date.setDate(start_date.getDate() - 1);

    body['start_date'] = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    body['end_date'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    searchRoomsViaDateAndId(body, async (err, initialResults) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Internal server error",
        });
      }

      let initialIdArray = [];
      initialResults.map((visit) => {
        return initialIdArray.push(visit.user_id);
      });

      let finalIdArray = [];
      finalIdArray.push(...new Set(initialIdArray));

      const queryResults = await Promise.all(
        finalIdArray.map(async (id) => {
          return new Promise((resolve, reject) =>
            getUserById(id, async (err, results) => {
              if (err) return reject(err);
              else {
                if (results === undefined) {
                  return resolve({ information: 'User not found' });
                }

                if (results.type === 'Student') {
                  const newQueryResults = new Promise((resolve, reject) =>
                    getStudentDetailsById(id, async (err, finalResults) => {
                      if (err) return reject(err);
                      else {
                        if (finalResults === undefined) {
                          results['data'] = 'Not verified';
                          return resolve({ information: results });
                        }

                        results['data'] = finalResults;
                        return resolve({ information: results });
                      }
                    }),
                  );

                  return resolve(newQueryResults);
                }
                if (results.type === 'Visitor') {
                  const newQueryResults = new Promise((resolve, reject) =>
                    getVisitorDetailsById(id, async (err, finalResults) => {
                      if (err) return reject(err);
                      else {
                        if (finalResults === undefined) {
                          results['data'] = 'Not verified';
                          return resolve({ information: results });
                        }
                        results['data'] = finalResults;
                        return resolve({ information: results });
                      }
                    }),
                  );
                  return resolve(newQueryResults);
                }
                if (results.type === 'Employee') {
                  const newQueryResults = new Promise((resolve, reject) =>
                    getEmployeeDetailsById(id, async (err, finalResults) => {
                      if (err) return reject(err);
                      else {
                        if (finalResults === undefined) {
                          results['data'] = 'Not verified';
                          return resolve({ information: results });
                        }
                        results['data'] = finalResults;
                        return resolve({ information: results });
                      }
                    }),
                  );
                  return resolve(newQueryResults);
                }

                results['data'] = 'Not verified';
                return resolve({ information: results });
              }
            }),
          );
        }),
      );

      return res.status(200).json({
        success: 1,
        config: body,
        data: queryResults,
      });
    });
  },
};
