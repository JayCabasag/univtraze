const pool = require('../../config/database');

module.exports = {
  addVisitedRoom: (data, callBack) => {
    pool.query(
      'INSERT INTO visited_rooms (user_id, room_id, temperature) VALUES (?,?,?)',
      [data.user_id, data.room_id, data.temperature],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        callBack(null, results);
      },
    );
  },
  getVisitedRoomById: (id, callBack) => {
    pool.query('SELECT * from visited_rooms where id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      callBack(null, results[0]);
    });
  },
  getVisitedRoomsByUserId: (id, callBack) => {
    pool.query('SELECT * from visited_rooms LEFT JOIN rooms ON visited_rooms.room_id = rooms.id  where visited_rooms.user_id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      callBack(null, results);
    });
  },
  getVisitedRoomsByRoomId: (id, callBack) => {
    pool.query('SELECT * from visited_rooms where room_id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      callBack(null, results);
    });
  },
  getAllVisitedRooms: (callBack) => {
    pool.query('SELECT * from visited_rooms where 1', [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      callBack(null, results);
    });
  },
};
