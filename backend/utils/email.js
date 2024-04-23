const nodemailer = require("nodemailer");

const nodemailerConfig = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Micro Focus Inc." <microfocusin@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/auth/reset-password/${token}`;
  const message = `<p>Please reset password by clicking on the following link :
  <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
   ${message}
   `,
  });
};

const sendEmailVerification = async ({ email, verificationToken, origin }) => {
  const verifyEmail = `${origin}/auth/verify-email/${verificationToken}`;
  console.log(verifyEmail);

  const message = `<p>Please confirm your email by clicking on the following link :
    <a href="${verifyEmail}">Verify Email</a> </p>`;
  console.log(message);

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${email}</h4>
      ${message}
      `,
  });
};

module.exports = { sendResetPasswordEmail, sendEmailVerification };
