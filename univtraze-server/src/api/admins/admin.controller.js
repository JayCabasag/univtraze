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
} = require('./admin.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
var generator = require('generate-password');

module.exports = {
  createAdmin: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    emailAdminCheck(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: 'Database connection Error',
        });
      }

      if (results.length !== 0) {
        return res.json({
          success: 0,
          message: 'Email/Username already have an account',
        });
      }

      createAdmin(body, (err, results) => {
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

  loginAdmin: (req, res) => {
    const body = req.body;

    getAdminByEmail(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          data: 'Incorrect Email or Password',
        });
      }

      const result = compareSync(body.password, results.password);

      if (result) {
        result.password = undefined;
        const jsonToken = sign({ result: results }, process.env.JSON_KEY, {
          expiresIn: '7d',
        });

        return res.json({
          success: 1,
          message: 'Login successfully',
          token: jsonToken,
        });
      } else {
        return res.json({
          success: 0,
          data: 'Incorrect Email or Password',
        });
      }
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
