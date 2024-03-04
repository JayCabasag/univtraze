const { genSaltSync, hashSync, compareSync, compare } = require('bcrypt');
const { sendRecoveryPassword } = require('../mailer/mailer.service');
const { emailCheck, getUserByEmail, updateUserPassword } = require('../users/user.service');
const {
  sendUserRecoveryCodeSchema,
  changeUserPasswordViaRecoveryCodeSchema,
  verifyRecoveryPasswordSchema,
} = require('./account_recovery.schemas');
const { updateUserRecoveryPassword, isRecoveryCodeWithin30Minutes } = require('./account_recovery.service');
var generator = require('generate-password');

module.exports = {
  getEmailRecoveryCode: (req, res) => {
    const { error } = sendUserRecoveryCodeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    const datas = req.body;

    emailCheck(datas, (err, userResult) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!userResult) {
        return res.status(404).json({
          message: 'Email is not registered yet.',
        });
      }

      datas.user_id = userResult.id;
      datas.recovery_password = generator.generate({
        length: 10,
        numbers: true,
        exclude: '/',
      });
      datas.unhashed_recovery_password = datas.recovery_password; // This is the one that we will be sending to the user
      console.log(datas.unhashed_recovery_password);
      const salt = genSaltSync(10);
      datas.recovery_password = hashSync(datas.recovery_password, salt);

      updateUserRecoveryPassword(datas, async (err, _finalResults) => {
        if (err) {
          return res.json({
            success: false,
            message: err.message,
          });
        }

        sendRecoveryPassword(datas, (error, _results) => {
          if (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(200).json({
            message: 'New recovery password was sent to your email',
          });
        });
      });
    });
  },
  verifyRecoveryPassword: (req, res) => {
    const { error } = verifyRecoveryPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    const datas = req.body;
    getUserByEmail(datas.email, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'Email not found',
        });
      }
      const isRecoveryPasswordMatched = compareSync(datas.recovery_password, results.recovery_password);

      if (isRecoveryPasswordMatched) {
        return res.status(401).json({
          message: "Recovery password don't match.",
        });
      }

      return res.status(204).json();
    });
  },
  changePasswordViaRecoveryCode: (req, res) => {
    const { error } = changeUserPasswordViaRecoveryCodeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Invalid payload',
      });
    }

    getUserByEmail(req.body.email, (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      if (!results) {
        return res.status(404).json({
          message: 'Email not found',
        });
      }

      req.body.user_id = results.id;
      isRecoveryCodeWithin30Minutes(req.body, (error, isWithin30Minutes) => {
        if (error) {
          return res.status(500).json({
            message: 'Internal server error',
          });
        }

        if (!isWithin30Minutes) {
          return res.status(400).json({
            message: 'Recovery password expired',
          });
        }

        const isMatchedRecoveryCode = compareSync(req.body.recovery_password, results.recovery_password);

        if (!isMatchedRecoveryCode) {
          return res.status(401).json({
            message: 'Recovery password is incorrect',
          });
        }

        const salt = genSaltSync(10);
        req.body.new_password = hashSync(req.body.new_password, salt);
        updateUserPassword(req.body, (error, _results) => {
          if (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
          return res.status(200).json({
            message: 'Password updated succefully',
          });
        });
      });
    });
  },
};
