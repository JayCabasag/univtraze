const {
  addRoom,
  getAllRooms,
  addVisitedRoom,
  checkIfRoomExists,
  searchRoomNumber,
  userVisitedRooms,
  addUserNotification,
  userTodaysTemperature,
  searchUsersByRoomId,
  searchRoomsViaDateAndId,
  getUserById,
  getEmployeeDetailsById,
  getStudentDetailsById,
  getVisitorDetailsById,
  addRoomVisitedNotificationToUser,
} = require('./room.service');

const moment = require('moment');

module.exports = {
  addRoom: (req, res) => {
    body = req.body;

    checkIfRoomExists(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }
      if (results.length > 0) {
        return res.json({
          success: 0,
          message: 'Room already Exist',
        });
      }

      addRoom(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.json({
            success: 0,
            message: 'Database connection Error',
          });
        }

        return res.status(200).json({
          success: 1,
          data: results,
        });
      });
    });
  },
  getAllRooms: (req, res) => {
    getAllRooms(async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      const queryResults = await Promise.all(
        results.map(async (room) => {
          var start_date = new Date();
          start_date.setDate(start_date.getDate() - 1);

          room['start_date'] = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          room['end_date'] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

          return new Promise((resolve, reject) =>
            searchUsersByRoomId(room, (err, results) => {
              if (err) return reject(err);
              else {
                let returnIdArray = [];

                results.map((user) => {
                  return returnIdArray.push(user.user_id);
                });

                let finalReturnedId = [];
                finalReturnedId.push(...new Set(returnIdArray));

                return resolve({
                  room_id: room.id,
                  building_name: room.building_name,
                  room_number: room.room_number,
                  totalUserVisited: results.length,
                  userVisited: results,
                  userVisitedByIds: finalReturnedId,
                });
              }
            }),
          );
        }),
      );

      return res.status(200).json({
        success: 1,
        data: queryResults,
      });
    });
  },

  addVisitedRoom: (req, res) => {
    body = req.body;

    addVisitedRoom(body, async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
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
          message: 'Database connection Error',
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
          message: 'Database connection Error',
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
          message: 'Database connection Error',
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
          message: 'Database connection Error',
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
