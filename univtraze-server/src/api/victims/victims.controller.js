const { getUserVisitedRooms, getUsersViaRoomIdAndDate, getUserIdsViaRoomIdAndDate } = require('./victims.service');

module.exports = {
  getFirstDegreeVictims: (req, res) => {
    const body = req.body;

    var start_date = new Date(body.date_reported);
    start_date.setDate(start_date.getDate() - body.date_range);

    body['start_date'] = start_date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    body['end_date'] = body.date_reported;

    getUserVisitedRooms(body, async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      if (results.length === 0) {
        return res.json({
          success: 0,
          data: 'No rooms visited found',
          config: body,
        });
      }

      //COnstructing of return array to a single array of rooms
      let newRoomArray = [];
      results.map((room_id) => {
        return newRoomArray.push(room_id.room_id);
      });

      let firstDegreeVictimsId = [];

      await Promise.all(
        newRoomArray.map(async (room_id) => {
          let newBody = body;
          newBody['room_id'] = room_id;

          return new Promise((resolve, reject) =>
            getUsersViaRoomIdAndDate(newBody, (err, results) => {
              if (err) return reject(err);
              else {
                let returnArray = [];

                results.map((victim) => {
                  return returnArray.push(victim.user_id);
                });

                return resolve({ room_id: room_id, userVisitedById: returnArray, userVisitedByData: results });
              }
            }),
          );
        }),
      ).then((results) => {
        let returnArray = [];

        results.map((result) => {
          return returnArray.push(...result.userVisitedById);
        });

        let initialReturnArray = [];
        initialReturnArray.push(...returnArray);

        firstDegreeVictimsId.push(...new Set(initialReturnArray));

        let valueToRemove = body.user_id;

        let filteredItems = firstDegreeVictimsId.filter(function (item) {
          return item !== valueToRemove;
        });

        firstDegreeVictimsId = filteredItems;
      });

      return res.json({
        success: 1,
        config: body,
        data: {
          initialVictim: body.user_id,
          type: body.type,
          case_id: body.case_id,
          start_date: body.start_date,
          end_date: body.end_date,
          date_range: body.date_range,
          date_reported: body.date_reported,
          firstDegreeVictimsId: firstDegreeVictimsId,
        },
      });
    });
  },

  getSecondDegreeVictims: async (req, res) => {
    // "initialVictim": 34,
    // "initialVictimType": "Employee",
    // "case_id": 1,
    // "start_date": "2022-06-13 21:12:15",
    // "end_date": "2022-07-14 05:12:15",
    // "date_range": 30,
    // "first_degree_victims": [ 4,3,37,15,16,10,12,2,38]

    const body = req.body;

    let roomsVisitedLists = [];
    let allUserVisitedRooms = [];

    if (body.first_degree_victims.length === 0) {
      return res.json({
        success: 0,
        message: 'No first degree victims found to get the second degree.',
      });
    }

    await Promise.all(
      body.first_degree_victims.map(async (victim) => {
        return new Promise((resolve, reject) =>
          getUserVisitedRooms(
            { user_id: victim, start_date: body.start_date, end_date: body.end_date },
            (err, roomResults) => {
              if (err) return reject(err);
              else {
                return resolve(roomResults);
              }
            },
          ),
        );
      }),
    ).then(async (results) => {
      let initialReturnedRoomId = [];

      results.map((room) => {
        return initialReturnedRoomId.push(...room);
      });

      let finalInitialRoomIds = [];

      initialReturnedRoomId.map((id) => {
        return finalInitialRoomIds.push(id.room_id);
      });

      roomsVisitedLists.push(...new Set(finalInitialRoomIds));

      const finalRoomIdlists = [];

      finalRoomIdlists.push(...new Set(finalInitialRoomIds));

      await Promise.all(
        finalRoomIdlists.map((room_id) => {
          return new Promise((resolve, reject) =>
            getUserIdsViaRoomIdAndDate(
              { room_id: room_id, start_date: body.start_date, end_date: body.end_date },
              (err, finalUsersResults) => {
                if (err) return reject(err);
                else {
                  let returnArray = [];
                  finalUsersResults.map((user) => {
                    return returnArray.push(user);
                  });

                  let finalReturnArrayists = [];
                  returnArray.map((arr) => {
                    return finalReturnArrayists.push(arr.user_id);
                  });
                  return resolve(finalReturnArrayists);
                }
              },
            ),
          );
        }),
      ).then((results) => {
        let idLists = [];

        results.map((result) => {
          return idLists.push(result);
        });

        let initialfinalIdLists = [];

        idLists.map((id) => {
          for (let i = 0; i < id.length; i++) {
            initialfinalIdLists.push(id[i]);
          }

          return;
        });

        //Remove duplicates
        let finalUserIdArray = [];
        finalUserIdArray.push(...new Set(initialfinalIdLists));

        //remove user that are included in 2nd degree

        let arrayToRemove = [];

        body.first_degree_victims.map((id) => {
          return arrayToRemove.push(id);
        });

        arrayToRemove.push(body.initialVictim);

        finalUserIdArray = finalUserIdArray.filter(function (n) {
          return arrayToRemove.indexOf(n) < 0;
        });

        allUserVisitedRooms = finalUserIdArray;
      });
    });

    return res.json({
      success: 1,
      config: body,
      data: {
        initialVictim: body.initialVictim,
        initialVictimType: body.initialVictimType,
        case_id: body.case_id,
        start_date: body.start_date,
        end_date: body.end_date,
        date_range: body.date_range,
        date_reported: body.date_reported,
        firstDegreeVictimsId: body.first_degree_victims,
        secondDegreeVictimsId: allUserVisitedRooms,
      },
    });
  },

  getThirdDegreeVictims: async (req, res) => {
    const body = req.body;
    let roomsVisitedLists = [];
    let allUserVisitedRooms = [];

    if (body.secondDegreeVictimsId.length === 0) {
      return res.json({
        success: 0,
        message: 'No second degree victims found to get the third degree victims.',
      });
    }

    await Promise.all(
      body.secondDegreeVictimsId.map(async (victim) => {
        return new Promise((resolve, reject) =>
          getUserVisitedRooms(
            { user_id: victim, start_date: body.start_date, end_date: body.end_date },
            (err, roomResults) => {
              if (err) return reject(err);
              else {
                return resolve(roomResults);
              }
            },
          ),
        );
      }),
    ).then(async (roomLists) => {
      let initialRoomIds = [];

      roomLists.map((id) => {
        for (let i = 0; i < id.length; i++) {
          initialRoomIds.push(id[i].room_id);
        }
        return;
      });

      let finalRoomIdlists = [];
      finalRoomIdlists.push(...new Set(initialRoomIds));

      await Promise.all(
        finalRoomIdlists.map((room_id) => {
          return new Promise((resolve, reject) =>
            getUserIdsViaRoomIdAndDate(
              { room_id: room_id, start_date: body.start_date, end_date: body.end_date },
              (err, finalUsersResults) => {
                if (err) return reject(err);
                else {
                  let returnArray = [];
                  finalUsersResults.map((user) => {
                    return returnArray.push(user);
                  });

                  let finalReturnArrayists = [];
                  returnArray.map((arr) => {
                    return finalReturnArrayists.push(arr.user_id);
                  });
                  return resolve(finalReturnArrayists);
                }
              },
            ),
          );
        }),
      ).then((userIdLists) => {
        let initialUserIdLists = [];

        userIdLists.map((id) => {
          for (let i = 0; i < id.length; i++) {
            initialUserIdLists.push(id[i]);
          }
          return;
        });

        //Remove duplicates
        let finalUserIdArray = [];
        finalUserIdArray.push(...new Set(initialUserIdLists));

        //remove user that are included in 2nd degree

        let arrayToRemove = [];

        body.firstDegreeVictimsId.map((id) => {
          return arrayToRemove.push(id);
        });

        arrayToRemove.push(body.initialVictim);

        body.secondDegreeVictimsId.map((id) => {
          return arrayToRemove.push(id);
        });

        finalUserIdArray = finalUserIdArray.filter(function (n) {
          return arrayToRemove.indexOf(n) < 0;
        });

        allUserVisitedRooms = finalUserIdArray;
      });
    });

    return res.json({
      success: 1,
      config: body,
      data: {
        initialVictim: body.initialVictim,
        initialVictimType: body.initialVictimType,
        case_id: body.case_id,
        start_date: body.start_date,
        end_date: body.end_date,
        date_range: body.date_range,
        date_reported: body.date_reported,
        firstDegreeVictimsId: body.firstDegreeVictimsId,
        secondDegreeVictimsId: body.secondDegreeVictimsId,
        thirdDegreeVictimsId: allUserVisitedRooms,
      },
    });
  },
};
