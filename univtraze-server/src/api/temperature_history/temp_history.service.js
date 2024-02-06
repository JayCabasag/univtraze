const pool = require('../../config/database');
var nodemailer = require('nodemailer');

module.exports = {
  getAllTempHistory: (callBack) => {
    pool.query(`SELECT * FROM temperature_history LEFT JOIN rooms ON temperature_history.room_id = rooms.id WHERE 1 ORDER BY temperature_history.id DESC;`, (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  getTempHistoryByUserId: (id, callBack) => {
    pool.query(
      `SELECT * FROM temperature_history LEFT JOIN rooms ON temperature_history.room_id = rooms.id WHERE temperature_history.user_id = ? ORDER BY temperature_history.id DESC;`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  addTemperatureHistory: (body, callBack) => {
    pool.query(
      'INSERT INTO temperature_history (user_id, temperature, unit_of_measurement, room_id, sensor_device, remarks) VALUES (?,?,?,?,?,?);',
      [body.user_id, body.temperature, body.unit_of_measurement, body.room_id, body.sensor_device, body.remarks],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
};
