const {
  create,
  emailCheck,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserType,
  addStudentDetails,
  updateStudentDetails,
  addEmployeeDetails,
  updateEmployeeDetails,
  updateVisitorDetails,
  addVisitorDetails,
  addAccountCreatedNotificationToUser,
  deactivateAccount,
  getEmployeeDetailsById,
  getVisitorDetailsById,
  getStudentDetailsById,
  getAllUsers,
  checkIfEmailAndRecoveryPasswordMatched,
  updateUserPassword,
  updateProfileInfoStudent,
  updateProfileInfoEmployee,
  updateProfileInfoVisitor,
  isStudentDetailsExists,
  isEmployeeDetailsExists,
  isVisitorDetailsExists,
} = require('./user.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const schemas = require("./../../utils/helpers/schemas")
const { USER_TYPE } = require("../../utils/helpers/types")
const { updateUserProfileSchema, changeUserPasswordSchema } = require('./user.schema');

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const { error } = schemas.signupSchema.validate(body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        message: errorMessage ?? 'Invalid payload',
      });
    }

    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    emailCheck(body, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (results) {
        return res.status(409).json({
          message: 'Email already have an account',
        });
      }

      create(body, async (err, results) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        await new Promise((resolve, reject) => {
          addAccountCreatedNotificationToUser(
            {
              notification_title: 'Account created successfully',
              notification_description: 'Account has been created successfully',
              notification_source: 'create_account',
              notification_type: 'create_account',
              notification_is_viewed: 0,
              notification_for: results.insertId,
            },
            (err, results) => {
              if (err) {
                return reject('Failed adding notification: ' + err.message);
              }
              return resolve('Successfully added Notification');
            },
          );
        });

        const tokenPayload = { id: results.insertId, email: body.email };
        const jsonToken = sign({ result: tokenPayload }, process.env.JSON_KEY, {
          expiresIn: '7d',
        });

        return res.status(200).json({
          user: { type: null, ...tokenPayload },
          token: jsonToken,
        });
      });
    });
  },
  signin: (req, res) => {
    const body = req.body;
    const { error } = schemas.siginSchema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({
        message: errorMessage ?? 'Invalid payload',
      });
    }

    getUserByEmail(body.email, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      if (!results) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      const result = compareSync(body.password, results.password);

      if (!result) {
        return res.status(401).json({
          message: 'Incorrect Email or Password',
        });
      }

      const tokenPayload = { id: results.id, email: body.email };
      const jsonToken = sign({ result: tokenPayload }, process.env.JSON_KEY, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        user: { type: results.type, ...tokenPayload },
        token: jsonToken,
      });
    });
  },
  verifyUser: (req, res) => {
    // Token id value
    req.body.id = req.user.result.id;

    getUserById(req.body.id, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
      if (!results) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const tokenPayload = { id: results.id, email: results.email };
      const jsonToken = sign({ result: tokenPayload }, process.env.JSON_KEY, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        user: { type: results.type, ...tokenPayload },
        token: jsonToken,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getAllUsers: (req, res) => {
    getAllUsers(async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'No users found',
        });
      }

      const queryResults = await Promise.all(
        results.map(async (user) => {
          if (user.type === 'student') {
            return new Promise((resolve, reject) =>
              getStudentDetailsById(user.id, (err, results) => {
                if (err) return reject(err);
                else return resolve({ user_id: user.id, email: user.email, userType: user.type, information: results });
              }),
            );
          }

          if (user.type === 'employee') {
            return new Promise((resolve, reject) =>
              getEmployeeDetailsById(user.id, (err, results) => {
                if (err) return reject(err);
                else return resolve({ user_id: user.id, email: user.email, userType: user.type, information: results });
              }),
            );
          }

          if (user.type === 'visitor') {
            return new Promise((resolve, reject) =>
              getVisitorDetailsById(user.id, (err, results) => {
                if (err) return reject(err);
                else return resolve({ user_id: user.id, email: user.email, userType: user.type, information: results });
              }),
            );
          }
        }),
      );

      return res.status(200).json({
        data: queryResults,
      });
    });
  },

  getStudentDetailsById: (req, res) => {
    const body = req.body;
    getStudentDetailsById(body.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      if (results === undefined) {
        return res.status(200).json({
          success: 0,
          message: 'No data found for this user',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  getEmployeeDetailsById: (req, res) => {
    const body = req.body;

    getEmployeeDetailsById(body.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      if (results === undefined) {
        return res.status(200).json({
          success: 0,
          message: 'No data found for this user',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  getVisitorDetailsById: (req, res) => {
    const body = req.body;
    getVisitorDetailsById(body.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      if (results === undefined) {
        return res.status(200).json({
          success: 0,
          message: 'No data found for this user',
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  updateUserType: (req, res) => {
    const { body } = req;
    const { error } = schemas.updateUserTypeSchema.validate(body);

    if (error) {
      return res.status(401).json({
        message: 'Some fields were empty',
      });
    }
    // Token id value
    req.body.id = req.user.result.id;

    updateUserType(body, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      getUserById(body.id, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        if (!results) {
          return res.status(404).json({
            message: 'User does not exists',
          });
        }

        delete results.password; // Password should not be send to the user
        return res.status(200).json({
          results,
        });
      });
    });
  },

  addStudentDetails: (req, res) => {
    const { body } = req;
    const { error } = schemas.addStudentDetailsSchema.validate(body);

    if (error) {
      console.log(error);
      return res.status(401).json({
        message: 'Some field were empty',
      });
    }

    isStudentDetailsExists(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (results.length == 0) {
        addStudentDetails(body, (err, results) => {
          if (err) {
            console.log('Erro', err);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }

          return res.status(200).json({
            data: results,
          });
        });
      }

      if (results.length > 0) {
        updateStudentDetails(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(200).json({
            data: results,
          });
        });
      }
    });
  },

  addEmployeeDetails: (req, res) => {
    const { body } = req;
    const { error } = schemas.addEmployeeDetails.validate(body);

    if (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }

    isEmployeeDetailsExists(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (results.length === 0) {
        addEmployeeDetails(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(200).json({
            data: results,
          });
        });
      }

      if (results.length > 0) {
        updateEmployeeDetails(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(200).json({
              message: 'Internal server error',
            });
          }

          return res.status(200).json({
            data: results,
          });
        });
      }
    });
  },

  addVisitorDetails: (req, res) => {
    const { body } = req;
    const { error } = schemas.addVisitorDetails.validate(body);

    if (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }

    isVisitorDetailsExists(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          message: 'Internal server errors',
        });
      }

      if (results.length == 0) {
        addVisitorDetails(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              message: 'Internal server error',
            });
          }

          return res.status(200).json({
            data: results,
          });
        });
      }

      if (results.length > 0) {
        updateVisitorDetails(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Internal server error',
            });
          }

          return res.status(200).json({
            data: results,
          });
        });
      }
    });
  },

  getUserDetailsById: async (req, res) => {
    const { error } = schemas.userIdSchema.validate(req.params);

    if (error) {
      return res.status(409).json({
        message: 'Invalid payload',
      });
    }

    req.body.id = parseInt(req.params.userId);
    const { body } = req;

    getUserById(body.id, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }

      if (!results.type) {
        return res.status(401).json({
          message: 'User not verified.',
        });
      }

      if (results.type == USER_TYPE.STUDENT) {
        return getStudentDetailsById(body.id, (err, results) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          if (!results) {
            return res.status(404).json({
              message: 'User not verified',
            });
          }

          return res.status(200).json({
            results,
          });
        });
      }

      if (results.type == USER_TYPE.EMPLOYEE) {
        return getEmployeeDetailsById(body.id, (err, results) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          if (!results) {
            return res.status(404).json({
              message: 'User not verified',
            });
          }

          return res.status(200).json({
            results,
          });
        });
      }
      if (results.type == USER_TYPE.VISITOR) {
        return getVisitorDetailsById(body.id, (err, results) => {
          if (err) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          if (!results) {
            return res.status(404).json({
              message: 'User not verified',
            });
          }

          return res.status(200).json({
            results,
          });
        });
      }
      return res.status(401).json({
        message: 'User not verified.',
      });
    });
  },

  getUserDetailsByIds: async (req, res) => {
    const ids = req.body.id_lists;

    const queryResults = await Promise.all(
      ids.map(async (id) => {
        return new Promise((resolve, reject) =>
          getUserById(id, async (err, results) => {
            if (err) return reject(err);
            else {
              if (results === undefined) {
                return resolve({ information: 'User not found' });
              }

              if (results.type === 'Student') {
                const newQueryResults = new Promise((resolve, reject) =>
                  getStudentDetailsById(id, async (err, finalResults) => {
                    if (err) return reject(err);
                    else {
                      if (finalResults === undefined) {
                        results['data'] = 'Not verified';
                        return resolve({ information: results });
                      }

                      results['data'] = finalResults;
                      return resolve({ information: results });
                    }
                  }),
                );

                return resolve(newQueryResults);
              }
              if (results.type === 'Visitor') {
                const newQueryResults = new Promise((resolve, reject) =>
                  getVisitorDetailsById(id, async (err, finalResults) => {
                    if (err) return reject(err);
                    else {
                      if (finalResults === undefined) {
                        results['data'] = 'Not verified';
                        return resolve({ information: results });
                      }
                      results['data'] = finalResults;
                      return resolve({ information: results });
                    }
                  }),
                );
                return resolve(newQueryResults);
              }
              if (results.type === 'Employee') {
                const newQueryResults = new Promise((resolve, reject) =>
                  getEmployeeDetailsById(id, async (err, finalResults) => {
                    if (err) return reject(err);
                    else {
                      if (finalResults === undefined) {
                        results['data'] = 'Not verified';
                        return resolve({ information: results });
                      }
                      results['data'] = finalResults;
                      return resolve({ information: results });
                    }
                  }),
                );
                return resolve(newQueryResults);
              }

              results['data'] = 'Not verified';
              return resolve({ information: results });
            }
          }),
        );
      }),
    );

    return res.json({
      success: 1,
      results: queryResults,
    });
  },
  updateUserPassword: (req, res) => {
    const body = req.body;

    return res.json({
      body,
    });
  },
  checkRecoveryPasswordAndEmailMatched: (req, res) => {
    const body = req.body;

    checkIfEmailAndRecoveryPasswordMatched(body, (err, results) => {
      if (err) {
        return res.json({
          success: false,
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.json({
          success: false,
          message: 'Recovery password do not matched.',
        });
      }

      return res.json({
        success: true,
        results: results,
      });
    });
  },

  updateUserPasswordFromRecovery: (req, res) => {
    const body = req.body;

    checkIfEmailAndRecoveryPasswordMatched(body, (err, results) => {
      if (err) {
        return res.json({
          success: false,
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.json({
          success: false,
          message: 'Recovery password do not matched. Please try again',
        });
      }

      let returnedResults = results[0];

      const salt = genSaltSync(10);
      body.new_password = hashSync(body.new_password, salt);

      updateUserPassword({ id: returnedResults.id, new_password: body.new_password }, (err, finalResults) => {
        if (err) {
          return res.json({
            success: false,
            message: err.message,
          });
        }

        return res.json({
          success: true,
          message: 'Password updated successfully',
          finalResults,
        });
      });
    });
  },
  changeUserPassword: (req, res) => {
    req.body.user_id = req.user.result.id;
    const { error } = changeUserPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    if (req.body.new_password != req.body.confirm_password) {
      return res.status(400).json({
        message: "Confirm password don't match",
      });
    }

    getUserById(req.body.user_id, (error, userResult) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!userResult) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const isMatchOldPassword = compareSync(req.body.new_password, userResult.password);
      if (isMatchOldPassword) {
        return res.status(400).json({
          message: 'Old and new password is the same!',
        });
      }

      const isMatchPassword = compareSync(req.body.old_password, userResult.password);

      if (!isMatchPassword) {
        return res.status(401).json({
          message: 'Wrong Password',
        });
      }

      const passwordSalt = genSaltSync(10);
      req.body.new_password = hashSync(req.body.new_password, passwordSalt);

      updateUserPassword(req.body, (err, finalResults) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        return res.status(200).json({
          result: finalResults,
        });
      });
    });
  },
  deactivateAccount: (req, res) => {
    const data = {
      userId: parseInt(req.params.userId),
      password: req.body.password,
    };

    const { error } = schemas.deactivateAccountSchema.validate(data);

    if (error) {
      console.log(error);
      return res.status(409).json({
        message: 'Some field where empty',
      });
    }

    getUserById(data.userId, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      let checkIfPasswordMatched = compareSync(data.password, results.password);

      if (!checkIfPasswordMatched) {
        return res.status(401).json({
          message: 'Incorrect password.',
        });
      }

      deactivateAccount(data.userId, (err, _finalResults) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }
        return res.status(201).json({
          message: 'Account deactivated',
        });
      });
    });
  },

  updatePersonalInfo: (req, res) => {
    const body = req.body;

    if (body.type === 'Student') {
      updateProfileInfoStudent(body, (err, results) => {
        if (err) {
          return res.json({
            success: 0,
            message: 'Database connection error.',
          });
        }

        return res.json({
          success: 1,
          message: 'Personal information updated successfully.',
          results: results,
          body,
        });
      });

      return;
    }

    if (body.type === 'Employee') {
      updateProfileInfoEmployee(body, (err, results) => {
        if (err) {
          return res.json({
            success: 0,
            message: 'Database connection error.',
          });
        }

        return res.json({
          success: 1,
          message: 'Personal information updated successfully.',
          results: results,
          body,
        });
      });
      return;
    }

    updateProfileInfoVisitor(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Database connection error.',
        });
      }

      return res.json({
        success: 1,
        message: 'Personal information updated successfully.',
        results: results,
        body,
      });
    });
  },
  updateUserProfileInformation: (req, res) => {
    req.body.user_id = req.user.result.id;
    const { error } = updateUserProfileSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    getUserById(req.body.user_id, (error, userResult) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!userResult) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      switch (userResult.type) {
        case 'student':
          return updateStudentDetails(req.body, (error, result) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            return res.status(200).json({
              result,
            });
          });
        case 'employee':
          return updateEmployeeDetails(req.body, (error, result) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            return res.status(200).json({
              result,
            });
          });
        case 'visitor':
          return updateVisitorDetails(req.body, (error, result) => {
            if (error) {
              return res.status(500).json({
                message: 'Internal server error',
              });
            }

            return res.status(200).json({
              result,
            });
          });

        default:
          return res.status(401).json({
            message: 'User not verified',
          });
      }
    });
  },
};
