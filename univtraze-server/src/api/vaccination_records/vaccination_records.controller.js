const schemas = require('../../utils/helpers/schemas');
const { getVaccinationRecords, getVaccinationRecordsFilterByUserId, addVaccinationRecord, isVaccinationRecordExists, updateVaccinationRecord, searchVaccinationRecordById } = require('./vaccination_records.service');

module.exports = {
  addVaccinationRecord: (req, res) => {
    req.body.user_id = req.user.result.id;
    const { error } = schemas.addVaccineRecordSchema.validate(req.body)
    if (error) {
      console.log(error)
      return res.status(409).json({
        message: "Invalid payload"
      })
    }

    isVaccinationRecordExists(req.body, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }

      if (results) {
        return res.status(409).json({
          message: "Vaccine record already exists"
        })
      }

      addVaccinationRecord(req.body, (error, results) => {
        if (error) {
          console.log(error)
          return res.status(500).json({
            message: "Internal server error"
          })
        }
        return res.status(200).json({
          results,
        });
      })
    })
  },
  updateVaccinationRecord: (req, res) => {
    req.body.user_id = req.user.result.id;
    const { error } = schemas.updateVaccineRecordSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        message: "Invalid payload"
      })
    }

    searchVaccinationRecordById(req.body.vaccination_record_id, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }

      if (!results) {
        console.log(results)
        return res.status(404).json({
          message: "Vaccine record does not exists"
        })
      }

      updateVaccinationRecord(req.body, (error, results) => {
        if (error) {
          console.log(error)
          return res.status(500).json({
            message: "Internal server error"
          })
        }
        return res.status(200).json({
          results,
        });
      })
    })
  },
  getVaccinationRecords: (req, res) => {
    const userId = req.query['user-id'];

    if (userId) {
      return getVaccinationRecordsFilterByUserId(userId, (error, results) => {
        if (error) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }
        return res.status(200).json({
          results,
        });
      });
    }

    getVaccinationRecords((error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      return res.status(200).json({
        results,
      });
    });
  },
};
