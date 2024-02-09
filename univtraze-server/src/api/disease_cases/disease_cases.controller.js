const schemas = require('../../utils/helpers/schemas');
const { getUserById } = require('../users/user.service');
const { addDiseaseCase, getDiseaseCaseByCaseNumber, getDiseaseCaseById, getUniqueDiseases, getDiseaseStatusTotal } = require('./disease_cases.service');

module.exports = {
  addDiseaseCase: (req, res) => {
    const { error } = schemas.addDiseaseCaseSchema.validate(req.body);
    if (error) {
      return res.status(409).json({
        message: 'Invalid payload',
      });
    }
    req.body.user_id = req.user.result.id;

    getUserById(req.body.user_id, (error, userResults) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!userResults) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      getDiseaseCaseByCaseNumber(req.body.case_number, (error, results) => {
        if (error) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        if (results) {
          return res.status(403).json({
            message: `Case number ${req.body.case_number} already exists`,
          });
        }

        addDiseaseCase(req.body, (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }

          getDiseaseCaseById(results.insertId, (error, results) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            delete userResults.password;
            delete userResults.provider;
            return res.status(200).json({
              user: userResults,
              disese_case: results,
            });
          });
        });
      });
    });
  },
  getDiseaseCase: (req, res) => {
    return res.status(200).json({
      message: 'Ok',
    });
  },
  getAllDiseaseOverview: (req, res) => {
    getUniqueDiseases((error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Internal server error"
        })
      }
      
      getDiseaseStatusTotal((error, statusTotalResults) => {
        if (error) {
          return res.status(500).json({
            message: "Internal server error"
          })
        }
  
        return res.status(200).json({
          results: {
            diseases: results,
            overview: statusTotalResults
          }
        })
      })
    })
  }
};
