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
  getAdminNotifications: (data, callBack) => {
    pool.query(
      `SELECT * FROM admin_notifications  where notification_for = ? ORDER BY createdAt  DESC LIMIT ? OFFSET ?`,
      [data.notification_for, data.page_limit, data.start_at - 1],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  updateAdminNotificationStatus: (data, callBack) => {
    pool.query(
      `UPDATE admin_notifications SET notification_is_viewed= ?  WHERE id = ?`,
      [data.is_viewed, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getTotalActiveAdminNotifications: (callBack) => {
    pool.query(
      `SELECT COUNT(notification_is_viewed) AS total_active_notifications FROM admin_notifications WHERE notification_is_viewed = 0`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getClinicNotifications: (data, callBack) => {
    pool.query(
      `SELECT * FROM clinic_notifications  where notification_for = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [data.notification_for, data.page_limit, data.start_at - 1],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getTotalActiveClinicNotifications: (callBack) => {
    pool.query(
      `SELECT COUNT(notification_is_viewed) AS total_active_notifications FROM clinic_notifications WHERE notification_is_viewed = 0`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  updateClinicNotificationStatus: (data, callBack) => {
    pool.query(
      `UPDATE clinic_notifications SET notification_is_viewed= ?  WHERE id = ?`,
      [data.is_viewed, data.id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  sendEmergencyReportPrescriptionViaEmail: (data, callBack) => {
    var mailOptions = {
      from: 'Univtraze Clinic',
      to: data.email,
      subject: 'Univtraze Clinic prescription',
      text: 'Prescription',
      attachments: [
        {
          filename: `${data.case_number}_${data.patient_name}_prescription.png`,
          path: `${data.image_url}`,
          cid: 'image',
        },
      ],
      html: `<b>Hi ${data.reporter_name}, your ${data.report_type} under the victim name : ${data.patient_name} has been recieved by our Univtraze clinic. The prescriptions is attached in this email.</b>
                       <p>Case number: ${data.case_number}<br>Date reported: ${data.reported_date}</p><br>Date prescription sent: ${data.presecription_sent_date}</p> <br />
                       <img src='cid:image'></img>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },
  sendSendCommunicableDiseaseReportPrescriptionViaEmail: (data, callBack) => {
    var mailOptions = {
      from: 'Univtraze Clinic',
      to: data.email,
      subject: 'Univtraze Clinic prescription',
      text: 'Prescription',
      attachments: [
        {
          filename: `${data.case_number}_${data.patient_name}_prescription.png`,
          path: `${data.image_url}`,
          cid: 'image',
        },
      ],
      html: `<b>Hi ${data.patient_name}, your ${data.report_type} has been recieved by our Univtraze clinic. The prescriptions is attached in this email.</b>
                   <p>Case number: ${data.case_number}<br>Date reported: ${data.reported_date}</p><br>Date prescription sent: ${data.presecription_sent_date}</p> <br />
                   <img src='cid:image'></img>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return callBack(error);
      } else {
        return callBack(null, info.response);
      }
    });
  },

  getUserNotificationsById: (data, callBack) => {
    pool.query(
      `SELECT * FROM users_notifications WHERE notification_for = ? order by created_at DESC limit 100 OFFSET ? `,
      [data.user_id, data.start_at],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },
  getUserNotificationsOverviewById: (data, callBack) => {
    pool.query(
      `SELECT CAST(SUM(CASE WHEN notification_is_viewed = false THEN 1 ELSE 0 END) AS INTEGER) AS not_viewed_total, CAST(SUM(CASE WHEN notification_is_viewed = true THEN 1 ELSE 0 END) AS INTEGER) AS viewed_total FROM users_notifications WHERE notification_for = ?`,
      [data.user_id, data.start_at],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  getTotalActiveUserNotificationsById: (data, callBack) => {
    pool.query(
      `SELECT COUNT(notification_is_viewed) AS total_notifications FROM users_notifications WHERE notification_for = ? AND notification_is_viewed = 0`,
      [data.user_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
  updateNotificationToViewedStatus: (id, callBack) => {
    pool.query(
      `UPDATE users_notifications SET notification_is_viewed = true WHERE id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      },
    );
  },

  getTotalUsers: (callBack) => {
    pool.query('SELECT COUNT(id) AS total_users FROM users', [], (error, results, fields) => {
      if (error) {
        return callBack(error);
      }
      return callBack(null, results[0]);
    });
  },
  getTotalCommunicableDisease: (callBack) => {
    pool.query(
      'SELECT COUNT(id) as total_communicable_disease FROM `reports` WHERE 1',
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
};
