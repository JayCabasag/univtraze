const pool = require('../../config/database');

module.exports = {
  checkIfRoomExists: (data, callBack) => {
    pool.query(
      `SELECT * FROM rooms WHERE room_number = ? AND building_name = ? AND room_name = ?`,
      [data.room_number, data.building_name, data.room_name],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  addRoom: (data, callBack) => {
    pool.query(
      `INSERT INTO rooms(room_number, building_name, room_name) VALUES (?,?,?)`,
      [data.room_number, data.building_name, data.room_name],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getRooms: (callBack) => {
    pool.query(
      `SELECT * FROM rooms WHERE 1`,
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getTotalRoomCount: (callBack) => {
    pool.query(
      `SELECT COUNT(id) as count FROM rooms;`,
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0].count);
      },
    );
  },


  addVisitedRoom: (data, callBack) => {
    pool.query(
      `INSERT INTO room_visits(user_id, room_id, temperature) VALUES (?,?,?)`,
      [data.user_id, data.room_id, data.temp],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  updateVisitedRoom: (data, callBack) => {
    pool.query(`UPDATE room_visits SET updatedAt = CURRENT_TIMESTAMP`, [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },

  searchRoomNumber: (data, callBack) => {
    pool.query(
      `SELECT id, room_number, building_name, room_name, createdAt, updatedAt FROM rooms WHERE room_number = ?`,
      [data.room_number],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  userVisitedRooms: (data, callBack) => {
    pool.query(
      `SELECT room_visits.id,room_visits.user_id,room_visits.room_id,rooms.room_number, rooms.building_name, rooms.room_name, room_visits.temperature,room_visits.createdAt,room_visits.updatedAt FROM room_visits, rooms WHERE room_visits.user_id = ? AND rooms.id = room_visits.room_id ORDER BY room_visits.createdAt DESC`,
      [data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  userTodaysTemperature: (data, callBack) => {
    pool.query(
      `SELECT id, user_id, room_id, temperature, createdAt, updatedAt FROM room_visits where createdAt between ? and CONCAT(?, ' 23:59:59') and user_id = ? ORDER BY id desc limit 1`,
      [data.dateToday, data.dateToday, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  addUserNotification: (data, callBack) => {
    pool.query(
      `INSERT INTO notifications(user_id, notification_for, notification_description) VALUES (?,?,?)`,
      [data.user_id, data.notification_for, data.notification_description],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  searchUsersByRoomId: (data, callBack) => {
    pool.query(
      `SELECT * FROM room_visits WHERE room_id = ? and created_at BETWEEN ? AND ?`,
      [data.id, data.start_date, data.end_date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  searchRoomsViaDateAndId: (data, callBack) => {
    pool.query(
      `SELECT * FROM room_visits WHERE room_id = ? AND createdAt BETWEEN ? AND ?`,
      [data.room_id, data.start_date, data.end_date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getStudentDetailsById: (id, callBack) => {
    pool.query(`SELECT * FROM student_details WHERE user_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  getVisitorDetailsById: (id, callBack) => {
    pool.query(`SELECT * FROM visitor_details WHERE user_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },

  getEmployeeDetailsById: (id, callBack) => {
    pool.query(
      `SELECT * FROM employee_details WHERE user_id = ?`,
      [id],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },

  addRoomVisitedNotificationToUser: (data, callBack) => {
    pool.query(
      `INSERT INTO users_notifications(notification_title, notification_description, notification_source, notification_type, notification_is_viewed, notification_for) VALUES (?,?,?,?,?,?)`,
      [
        data.notification_title,
        data.notification_description,
        data.notification_source,
        data.notification_type,
        data.notification_is_viewed,
        data.notification_for,
      ],

      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  getRoomById: (id, callBack) => {
    pool.query('SELECT * from rooms WHERE id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
};
