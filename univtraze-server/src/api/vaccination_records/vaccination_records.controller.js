const { insertVaccineData, updateVaccineData, checkIfVaccineRecordExists, getVaccinationRecords } = require('./vaccination_records.service');

module.exports = {
  updateVaccineData: (req, res) => {
    const body = req.body;
    updateVaccineData(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  insertVaccineData: (req, res) => {
    const body = req.body;

    insertVaccineData(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  addVaccineData: (req, res) => {
    const body = req.body;

    checkIfVaccineRecordExists(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Database connection error',
        });
      }
      if (results.length <= 0) {
        insertVaccineData(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: 0,
              message: 'Database connection Error',
            });
          }

          return res.status(200).json({
            success: 1,
            data: results,
          });
        });
      }

      updateVaccineData(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.json({
            success: 0,
            message: 'Database connection Error',
          });
        }

        return res.status(200).json({
          success: 1,
          data: results,
        });
      });
    });
  },

  getVaccinationRecords: (req, res) => {
    getVaccinationRecords((error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }
      return res.status(200).json({
        results
      })
    })
  },
};
