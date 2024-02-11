const pool = require('../../config/database');

module.exports = {
  updateVaccineData: (data, callBack) => {
    pool.query(
      `UPDATE vaccination_records SET user_id=?,firstdose_vaxname=?,firstdose_date=?,seconddose_vaxname=?,seconddose_date=?,booster_vaxname=?,booster_date=? WHERE user_id = ?`,
      [
        data.user_id,
        data.firstdose_vaxname,
        data.firstdose_date,
        data.seconddose_vaxname,
        data.seconddose_date,
        data.booster_vaxname,
        data.booster_date,
        data.user_id,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  insertVaccineData: (data, callBack) => {
    pool.query(
      `INSERT INTO vaccination_records(user_id, firstdose_vaxname, firstdose_date, seconddose_vaxname, seconddose_date, booster_vaxname, booster_date) VALUES (?,?,?,?,?,?,?)`,
      [
        data.user_id,
        data.firstdose_vaxname,
        data.firstdose_date,
        data.seconddose_vaxname,
        data.seconddose_date,
        data.booster_vaxname,
        data.booster_date,
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  checkIfVaccineRecordExists: (data, callBack) => {
    pool.query(`select * from vaccination_records where user_id = ?`, [data.user_id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  getVaccinationRecords: (callBack) => {
    pool.query(`select * from vaccination_records`, [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  }
};
