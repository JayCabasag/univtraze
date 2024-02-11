const pool = require('../../config/database');

module.exports = {
  getVaccinationRecords: (callBack) => {
    pool.query(`select * from vaccination_records`, [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  getVaccinationRecordsFilterByUserId: (id, callBack) => {
    pool.query(`select * from vaccination_records where user_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  isVaccinationRecordExists: (id, callBack) => {
    pool.query(`select * from vaccination_records where id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  addVaccinationRecord: (data, callBack) => {
    pool.query(
      `INSERT INTO vaccination_records (user_id, vaccine_disease, vaccine_name, dose_number, vaccine_name, date) VALUES (?,?,?,?,?,?)`,
      [data.user_id, data.vaccine_disease, data.vaccine_name, data.dose_number, data.vaccine_name, data.date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  updateVaccinationRecord: (data, callBack) => {
    pool.query(
      `UPDATE vaccination_records SET user_id = ?, vaccine_disease = ?, vaccine_name = ?, dose_number = ?, date = ?) WHERE id = ?`,
      [data.user_id, data.vaccine_disease, data.vaccine_name, data.dose_number, data.vaccine_name, data.date, data.vaccination_record_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
};
