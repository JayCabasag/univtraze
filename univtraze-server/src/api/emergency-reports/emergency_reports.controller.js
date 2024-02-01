const schemas = require("../../utils/helpers/schemas");
const { getUserById } = require("../users/user.service");
const { createEmergencyReport, getEmergencyReportById } = require("./emergency_reports.service");

module.exports = {
  createEmergencyReport: (req, res) => {
    const { error } = schemas.createEmergencyReportSchema.validate(req.body)
    if (error) {
        return res.status(409).json({
            message: "Bad request"
        })
    }
    getUserById(req.body.reported_by, (error, userResults) => {
        if (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
        if (!userResults) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        
        delete userResults.password;
        delete userResults.provider;
        createEmergencyReport(req.body, (error, results) => {
            if (error) {
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
            getEmergencyReportById(results.insertId, (error, results) => {
                if (error) {
                    return res.status(500).json({
                        message: "Internal server error"
                    })
                }

                if (!results) {
                    return res.status(404).json({
                        message: "Emergency report not found"
                    })
                }

                return res.status(200).json({
                    results,
                    reported_by: userResults
                })
            })
        })
    })
  },
  getEmergencyReportById: (req, res) => {
    return res.status(200).json({
      message: 'OK',
    });
  },
};
