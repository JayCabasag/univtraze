const { transporter } = require("../../config/emailConfig");

module.exports = {
  sendEmailNotification: (data, callBack) => {
    var mailOptions = {
      from: data.sent_by,
      to: data.user_email,
      subject: data.email_subject,
      text: data.email_message,
      attachments: [
        {
          filename: 'clinic.png',
          path: 'https://firebasestorage.googleapis.com/v0/b/univtrazeapp.appspot.com/o/Untitled.png?alt=media&token=b42bbec9-0b9d-48c1-9d76-50ec761f4578',
          cid: 'logo', //my mistake was putting "cid:logo@cid" here!
        },
      ],
      html: `<b>Hi ${data.fullname}, your report has been recieved by our Univtraze clinic. Please wait for further notification and instructions from us.</b>
                   <p>Case number: ${data.case_number} <br> Disease name: ${data.disease_name}<br>Date reported: ${data.date_reported}</p> 
                   <img src='cid:logo'></img>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },
};
