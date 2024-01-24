const pool = require('../../config/database');

module.exports = {
  getDiseaseCase: (callBack) => {
    pool.query('SELECT * from disease reports', [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  addDiseaseCase: (data, callBack) => {
    pool.query(
      'INSERT INTO disease_reports (user_id, case_number, disease_name, document_proof_image) VALUES (?,?,?,?)',
      [data.user_id, data.case_number, data.disease_name, data.document_proof_image],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getDiseaseCaseByCaseNumber: (case_number, callBack) => {
    pool.query('SELECT * from disease_reports WHERE case_number = ?', [case_number], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  getDiseaseCaseById: (id, callBack) => {
    pool.query('SELECT * from disease_reports where id = ?', [id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  getDiseaseCaseByUserId: (id, callBack) => {
    pool.query('', [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
};
