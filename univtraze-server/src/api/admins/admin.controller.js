const {
  getAdminByEmail,
  createAdmin,
  emailAdminCheck,
  addAdminRecoveryPassword,
  sendLinkToEmail,
  checkIfEmailAndRecoveryPasswordMatched,
  updateAdminPassword,
  checkIfPasswordMatched,
  updateAdminCredentials,
  getAdminById,
} = require('./admin.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
var generator = require('generate-password');
const schemas = require('../../utils/helpers/schemas');

module.exports = {
  createAdmin: (req, res) => {
    const { error } = schemas.createAdminSchema.validate(req.body)

    if (error) {
      return res.status(400).json({
        message: "Invalid payload"
      })
    }
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    emailAdminCheck(body, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (results.length > 0) {
        return res.status(403).json({
          message: 'Email/Username already have an account',
        });
      }

      createAdmin(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        getAdminById(results.insertId, (error, results) => {
          if (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }

          if (!results) {
            return res.status(403).json({
              message: 'Admin does not exists',
            });
          }

          delete results.password;
          delete results.recovery_password;
          delete results.recovery_timestamp;

          const jsonToken = sign({ id: results.id, email: results.email }, process.env.JSON_KEY, {
            expiresIn: '7d',
          });

          return res.status(200).json({
            admin: { ...results },
            token: jsonToken,
          });
        });
      });
    });
  },

  loginAdmin: (req, res) => {
    const { error } = schemas.loginAdminSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    getAdminByEmail(req.body, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(401).json({
          message: 'Incorrect Email or Password',
        });
      }

      const isPasswordMatch = compareSync(req.body.password, results.password);

      if (!isPasswordMatch) {
        return res.status(401).json({
          message: 'Incorrect Email or Password',
        });
      }

      delete results.password;
      delete results.recovery_password;
      delete results.recovery_timestamp;

      const jsonToken = sign({ id: results.id, email: results.email }, process.env.JSON_KEY, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        admin: { ...results },
        token: jsonToken,
      });
    });
  },
  resetAdminPassword: (req, res) => {
    const body = req.body;

    emailAdminCheck(body, (err, results) => {
      if (err) {
        return res.json({
          success: false,
          message: err.message,
        });
      }

      if (results.length === 0) {
        return res.json({
          success: false,
          message: 'Email is not registered as an admin',
        });
      }

      body['recovery_password'] = generator.generate({
        length: 10,
        numbers: true,
        exclude: '/',
      });

      addAdminRecoveryPassword(body, async (err, results) => {
        if (err) {
          return res.json({
            success: false,
            message: err.message,
          });
        }

        await new Promise((resolve, reject) => {
          sendLinkToEmail(body, (err, results) => {
            if (err)
              return reject(
                res.json({
                  success: false,
                  message: err.message,
                }),
              );

            return resolve(
              res.json({
                success: true,
                data: results,
                message: 'Recovery password was sent to your email',
              }),
            );
          });
        });
      });
    });
  },

  updateAdminPassword: (req, res) => {
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
          message: 'Recovery password not matched!.',
        });
      }

      const salt = genSaltSync(10);
      body.new_password = hashSync(body.new_password, salt);

      updateAdminPassword(body, (err, results) => {
        if (err) {
          return res.json({
            success: false,
            message: error.message,
          });
        }

        return res.json({
          success: true,
          results: results,
          message: 'Password updated successfully!',
        });
      });
    });
  },

  updateAdminCredentials: (req, res) => {
    const id = req.body.id;
    const body = req.body;

    checkIfPasswordMatched(body, async (err, results) => {
      if (err) {
        return res.json({
          success: false,
          message: error.message,
        });
      }

      const checkIfMatched = compareSync(body.old_password, results.password);

      if (!checkIfMatched) {
        return res.json({
          success: false,
          message: 'Old password is incorrect',
        });
      }

      const salt = genSaltSync(10);
      const new_password = hashSync(body.new_password, salt);

      updateAdminCredentials({ id: results.id, new_password: new_password }, (err, finalResults) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Database connection error',
          });
        }

        return res.json({
          success: true,
          message: 'Updated successfully!',
          results: finalResults,
        });
      });
    });
  },
};
