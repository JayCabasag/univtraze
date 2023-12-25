const pool = require('../../config/database');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  auth: {
    user: 'univtraze.2022@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  emailClinicAdminCheck: (data, callBack) => {
    pool.query(
      `SELECT * FROM clinic_credentials WHERE email = ? || username = ?`,
      [data.email, data.username],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  createClinicAdmin: (data, callBack) => {
    pool.query(
      `INSERT INTO clinic_credentials(username, email, password) 
                         VALUES (?,?,?)`,
      [data.username, data.email, data.password],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getClinicAdminByEmail: (data, callBack) => {
    pool.query(
      `SELECT * FROM clinic_credentials WHERE email = ? || username = ?`,
      [data.email, data.username],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },

  getTotalActiveEmergencyReports: (callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalEmergencyReport FROM emergency_reporting`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalResolvedEmergencyReports: (callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalResolvedEmergencyReport FROM emergency_reporting where case_status = "resolved"`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getTotalCommunicableDiseaseReports: (callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalCommunicableDiseaseReport FROM reports`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalCommunicableDiseaseReportedOngoing: (callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalCommunicableDiseaseReportedOngoing FROM reports where case_status = "On-going"`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalCommunicableDiseaseReportedResolved: (callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalCommunicableDiseaseReportedResolved FROM reports where case_status = "Resolved"`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalCommunicableDiseaseReportedTodayOngoing: (data, callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalCommunicableDiseaseReportedOngoingToday FROM reports where case_status = "On-going" AND createdAt Between ? AND ?`,
      [data.start_date, data.end_date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalCommunicableDiseaseReportedTodayResolved: (data, callBack) => {
    pool.query(
      `SELECT DISTINCT COUNT(id) as totalCommunicableDiseaseReportedResolvedToday FROM reports where case_status = "Resolved" AND createdAt Between ? AND ?`,
      [data.start_date, data.end_date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  checkIfIdAndPasswordMatched: (data, callBack) => {
    pool.query(`SELECT * FROM clinic_credentials WHERE id = ?`, [data.user_id], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  updateNewPassword: (data, callBack) => {
    pool.query(
      `UPDATE clinic_credentials SET password=? WHERE id = ?`,
      [data.new_password, data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  checkIfEmailExist: (data, callBack) => {
    pool.query(`SELECT * FROM clinic_credentials where email = ?`, [data.email], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results);
    });
  },
  addClinicRecoveryPassword: (data, callBack) => {
    pool.query(
      `UPDATE clinic_credentials SET recovery_password=? WHERE email = ?`,
      [data.recovery_password, data.email],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  sendLinkToEmail: (data, callBack) => {
    let link = `http://clinic.univtraze.net/reset-password-from-email/${data.email}&${data.recovery_password}`;

    var mailOptions = {
      from: 'Univtraze Clinic',
      to: data.email,
      subject: 'Univtraze Recovery Password',
      text: 'Clinic password reset request.',
      html: `This email is requesting for new password for Univtraze Clinic credentials: <br /> Please click this link to continue: <a href=${link}>Link</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },
  checkIfEmailAndRecoveryPasswordMatched: (data, callBack) => {
    pool.query(
      `SELECT * FROM clinic_credentials WHERE email = ? AND recovery_password = ?`,
      [data.email, data.recovery_password],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  updateClinicCredentials: (data, callBack) => {
    pool.query(
      `UPDATE clinic_credentials SET password = ? WHERE id = ?`,
      [data.new_password, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
};
