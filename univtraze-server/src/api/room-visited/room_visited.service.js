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
};
