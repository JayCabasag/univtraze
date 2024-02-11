const pool = require('../../config/database');

module.exports = {
  createEmergencyReport: (data, callBack) => {
    pool.query(
      'INSERT INTO emergency_reports (reported_by, patient_name, symptoms, description, room_id) VALUES (?,?,?,?,?)',
      [data.reported_by, data.patient_name, data.symptoms, data.description, data.room_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getEmergencyReportById: (id, callBack) => {
    pool.query('SELECT * from emergency_reports where id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  getEmergencyReportByRoomId: (id, callBack) => {
    pool.query('SELECT * from emergency_reports where room_id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  getEmergencyReportByReportedById: (id, callBack) => {
    pool.query('SELECT * from emergency_reports where reported_by = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
};
