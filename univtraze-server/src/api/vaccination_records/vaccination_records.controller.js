const { getVaccinationRecords, getVaccinationRecordsFilterByUserId } = require('./vaccination_records.service');

module.exports = {
  addVaccinationRecord: (req, res) => {
    return res.status(200).json({
      message: 'Ok',
    });
  },
  updateVaccinationRecord: (req, res) => {
    return res.status(200).json({
      message: 'Ok',
    });
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
