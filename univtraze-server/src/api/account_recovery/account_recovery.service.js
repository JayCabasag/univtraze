const pool = require('../../config/database');

module.exports = {
  updateUserRecoveryPassword: (data, callBack) => {
    pool.query(
      `update users set recovery_password = ?, recovery_timestamp = CURRENT_TIMESTAMP where id = ?`,
      [data.recovery_password, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  
  isRecoveryCodeWithin30Minutes: (data, callBack) => {
    pool.query(
      `SELECT 
          CASE 
              WHEN recovery_timestamp < DATE_ADD(NOW(), INTERVAL -30 MINUTE) THEN false
              ELSE true
          END AS is_valid
      FROM 
          users where id = ?;`,
      [data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]?.is_valid ?? false);
      },
    );
  }
};
