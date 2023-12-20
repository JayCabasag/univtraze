const {sendEmailNotification} = require("./mailer.service");

module.exports = {

    notifyUserForCaseReported: (req, res) => {
       
        body = req.body

        sendEmailNotification(body, (err, results) => {
                if(err){
                    console.log(err)
                    return res.json({
                        success: 0,
                        message: "Database connection Error"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Email sent successfully",
                    data: results
                });
            });

    }
}