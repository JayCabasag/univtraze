const {
  getAdminNotifications,
  updateAdminNotificationStatus,
  getTotalActiveAdminNotifications,
  getClinicNotifications,
  getTotalActiveClinicNotifications,
  updateClinicNotificationStatus,
  sendEmergencyReportPrescriptionViaEmail,
  sendSendCommunicableDiseaseReportPrescriptionViaEmail,
  getUserNotificationsById,
  getTotalActiveUserNotificationsById,
  updateUserNotificationStatus,
  getTotalUsers,
  getTotalCommunicableDisease,
} = require('./notifications.service');

const moment = require('moment');

module.exports = {
  adminNotifications: (req, res) => {
    const body = req.body;

    getAdminNotifications(body, (error, results) => {
      if (error) {
        return res.json({
          success: 0,
          message: error.message,
        });
      }

      return res.json({
        success: 1,
        config: body,
        data: results,
      });
    });
  },

  updateAdminNotificationStatus: (req, res) => {
    const body = req.body;

    updateAdminNotificationStatus(body, (error, results) => {
      if (error) {
        return res.json({
          success: 0,
          message: error.message,
        });
      }

      return res.json({
        success: 1,
        config: body,
        data: results,
      });
    });
  },

  getTotalActiveAdminNotifications: (req, res) => {
    getTotalActiveAdminNotifications((error, results) => {
      if (error) {
        return res.json({
          success: 0,
          message: error.message,
        });
      }

      return res.json({
        success: 1,
        total_active_notifications: results[0].total_active_notifications,
      });
    });
  },
  getClinicNotifications: (req, res) => {
    const body = req.body;

    getClinicNotifications(body, (error, results) => {
      if (error) {
        return res.json({
          success: 0,
          message: error.message,
        });
      }

      return res.json({
        success: 1,
        config: body,
        data: results,
      });
    });
  },
  getTotalActiveClinicNotifications: (req, res) => {
    getTotalActiveClinicNotifications((error, results) => {
      if (error) {
        return res.json({
          success: 0,
          message: error.message,
        });
      }

      return res.json({
        success: 1,
        total_active_notifications: results[0].total_active_notifications,
      });
    });
  },

  updateClinicNotificationsStatus: (req, res) => {
    const body = req.body;

    updateClinicNotificationStatus(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: err.message,
        });
      }

      return res.json({
        success: true,
        data: results,
      });
    });
  },
  sendEmergencyReportPrescriptionViaEmail: (req, res) => {
    const body = req.body;
    body['presecription_sent_date'] = moment().format('YYYY-MM-DD hh:mm a');

    sendEmergencyReportPrescriptionViaEmail(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Error sending prescription via email' + err,
        });
      }

      return res.json({
        success: 1,
        message: results,
      });
    });
  },
  sendSendCommunicableDiseaseReportPrescriptionViaEmail: (req, res) => {
    const body = req.body;
    body['presecription_sent_date'] = moment().format('YYYY-MM-DD hh:mm a');

    sendSendCommunicableDiseaseReportPrescriptionViaEmail(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Error sending prescription via email' + err,
        });
      }

      return res.json({
        success: 1,
        message: results,
      });
    });
  },
  getUserNotificationsByUserId: (req, res) => {
    const userId = req.user.result.id;
    const startAt = req.query?.["start-at"] ?? 0;
    const body = { user_id: userId, start_at: startAt };

    getUserNotificationsById(body, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Database connection error',
        });
      }

      return res.status(200).json({
        results: results,
      });
    });
  },
  getTotalActiveUserNotifications: (req, res) => {
    const body = req.body;

    getTotalActiveUserNotificationsById(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Database connection error',
        });
      }

      return res.json({
        success: 1,
        results: results,
      });
    });
  },
  updateUserNotificationStatus: (req, res) => {
    const body = req.body;

    updateUserNotificationStatus(body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          message: 'Database connection error',
        });
      }

      return res.json({
        success: 1,
        message: 'Updated notification status successfully!',
      });
    });
  },
  getUnivtrazeDataForLanding: async (req, res) => {
    let totalUsers = await new Promise((resolve, reject) => {
      getTotalUsers((err, results) => {
        if (err) {
          return reject();
        }

        return resolve(results);
      });
    });

    let totalCommunicableDisease = await new Promise((resolve, reject) => {
      getTotalCommunicableDisease((err, results) => {
        if (err) {
          return reject();
        }

        return resolve(results);
      });
    });

    if (!totalUsers || !totalCommunicableDisease) {
      return res.json({
        success: 0,
        message: 'Database connection error',
      });
    }

    return res.json({
      success: 1,
      total_users: totalUsers.total_users,
      total_communicable_disease: totalCommunicableDisease.total_communicable_disease,
    });
  },
};
