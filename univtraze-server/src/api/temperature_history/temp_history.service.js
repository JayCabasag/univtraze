const pool = require('../../config/database');

module.exports = {
  getAllTempHistory: (callBack) => {
    pool.query(`SELECT * FROM temperature_history ORDER BY id DESC LIMIT 100;`, (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  getTempHistoryByUserId: (id, callBack) => {
    pool.query(
      `SELECT * FROM temperature_history WHERE temperature_history.user_id = ? ORDER BY id DESC LIMIT 100;`,
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
