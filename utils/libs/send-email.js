const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EXCHANGE_SMTP_HOST,
    port: process.env.EXCHANGE_SMTP_PORT,
    auth: {
      user: process.env.EXCHANGE_SMTP_USER,
      pass: process.env.EXCHANGE_SMTP_PASSWORD,
    },
  });
  const message = {
    from: `${process.env.EXCHANGE_EMAIL_FROM_NAME} <${process.env.EXCHANGE_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

module.exports.sendEmail = sendEmail;
