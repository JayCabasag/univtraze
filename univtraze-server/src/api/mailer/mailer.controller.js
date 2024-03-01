const { sendEmailNotification, sendRecoveryPassword } = require('./mailer.service');

module.exports = {
  notifyUserForCaseReported: (req, res) => {
    const body = req.body;
    sendEmailNotification(body, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      return res.status(200).json({
        results
      });
    });
  },
  sendUserRecoveryPassword: (req, res) => {
    const body = req.body
    sendRecoveryPassword(body, (error, results) => {
      if (error){
        return res.status(500).json({
          message: "Internal server error"
        })
      }
      return res.status(200).json({
        results
      })
    })
  }
};
