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
  isVaccinationRecordExists: (data, callBack) => {
    pool.query(
      `select * from vaccination_records where user_id = ? AND vaccine_disease = ? AND vaccine_name = ?`,
      [data.user_id, data.vaccine_disease, data.vaccine_name],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  getVaccinationRecordsFilterById: (id, callBack) => {
    pool.query(`select * from vaccination_records where vaccination_record_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  addVaccinationRecord: (data, callBack) => {
    pool.query(
      `INSERT INTO vaccination_records (user_id, vaccine_disease, dose_number, vaccine_name, date) VALUES (?,?,?,?,?)`,
      [data.user_id, data.vaccine_disease, data.dose_number, data.vaccine_name, data.date],
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
      `UPDATE vaccination_records SET user_id = ?, vaccine_disease = ?, vaccine_name = ?, dose_number = ?, date = ? WHERE vaccination_record_id = ?`,
      [data.user_id, data.vaccine_disease, data.vaccine_name, data.dose_number, data.date, data.vaccination_record_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  deleteVaccinationRecord: (id, callBack) => {
    pool.query(`DELETE FROM vaccination_records WHERE vaccination_record_id = ?`, [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
};
