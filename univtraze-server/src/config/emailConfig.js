const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  auth: {
    user: 'univtraze@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  transporter,
};
