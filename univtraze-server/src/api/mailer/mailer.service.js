const { transporter } = require('../../config/emailConfig');

module.exports = {
  sendEmailNotification: (data, callBack) => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: data.email,
      subject: 'Successful Disease Report Submission',
      attachments: [
        {
          filename: 'clinic.png',
          path: 'https://firebasestorage.googleapis.com/v0/b/univtraze-9ec8d.appspot.com/o/mailer-assets%2Funivtraze-clinic.png?alt=media&token=32844c0d-81a3-4aec-8f74-502b4f34e169',
          cid: 'logo',
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <p style="font-size: 18px;">Hi ${data.fullname},</p>
          <p style="font-size: 16px;">Your report has been received by our Univtraze clinic. Please wait for further notification and instructions from us.</p>
          <hr style="border: 0; border-top: 1px solid #ddd;">
          <p style="font-size: 16px;"><strong>Case number:</strong> ${data.case_number}</p>
          <p style="font-size: 16px;"><strong>Disease name:</strong> ${data.disease_name}</p>
          <p style="font-size: 16px;"><strong>Date reported:</strong> ${data.date_reported}</p>
          <img src='cid:logo' alt="Clinic Logo" style="width: 100%; margin-top: 20px;">
        </div>
      `.trim(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },

  sendRecoveryPassword: (data, callBack) => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: data.email,
      subject: 'Recovery Password',
      attachments: [
        {
          filename: 'univtraze_app.png',
          path: 'https://firebasestorage.googleapis.com/v0/b/univtraze-9ec8d.appspot.com/o/mailer-assets%2Funivtraze-app.png?alt=media&token=d6829fb9-ff46-4f12-860a-781dd6f86f29',
          cid: 'logo',
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <p style="font-size: 16px;">Your recovery password is <span style="color: #0000FF">${data.unhashed_recovery_password}</span>.</p>
          <hr style="border: 0; border-top: 1px solid #ddd;">
          <p style="font-size: 16px;"><strong style="color: #FF0000">Note:</strong> This is only valid for 30 minutes</p>
          <img src='cid:logo' alt="Clinic Logo" style="width: 100%; margin-top: 20px;">
        </div>
      `.trim(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },

  sendDiseaseReportConfirmationEmail: (data, callBack) => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: data.email,
      subject: 'Disease Report Submission Confirmation',
      attachments: [
        {
          filename: 'univtraze_app.png',
          path: 'https://firebasestorage.googleapis.com/v0/b/univtraze-9ec8d.appspot.com/o/mailer-assets%2Funivtraze-app.png?alt=media&token=d6829fb9-ff46-4f12-860a-781dd6f86f29',
          cid: 'logo',
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <p style="font-size: 16px;">
            Thank you for submitting your disease report via the Univtraze App. Your case has been assigned the following reference number: <span style="color: #3498db">${data.case_number}</span>. It was reported on: ${data.date_reported}. Rest assured, it will be reviewed by our clinic promptly.
          </p>
          <hr style="border: 0; border-top: 1px solid #ddd;">
          <img src='cid:logo' alt="Clinic Logo" style="width: 100%; margin-top: 20px;">
        </div>
      `.trim(),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },

  sendEmergencyReportConfirmationEmail: (data, callBack) => {
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: data.email,
      subject: 'Emergency Report Submission Confirmation',
      attachments: [
        {
          filename: 'univtraze_app.png',
          path: 'https://firebasestorage.googleapis.com/v0/b/univtraze-9ec8d.appspot.com/o/mailer-assets%2Funivtraze-app.png?alt=media&token=d6829fb9-ff46-4f12-860a-781dd6f86f29',
          cid: 'logo',
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <p style="font-size: 16px;">
            Thank you for submitting an emergency report via the Univtraze App. The emergency report case has been assigned the following reference number: <span style="color: #3498db">${data.case_number}</span>. It was reported on: ${data.date_reported}. Rest assured, it will be reviewed by our clinic promptly.
          </p>
          <hr style="border: 0; border-top: 1px solid #ddd;">
          <img src='cid:logo' alt="Clinic Logo" style="width: 100%; margin-top: 20px;">
        </div>
      `.trim(),
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
