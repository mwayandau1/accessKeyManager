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
  /**
   * creating a nodemailer transport
   */
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return await transporter.sendMail({
    from: '"Micro Focus Inc." <microfocusin@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

const sendResetPasswordEmail = async ({ email, token }) => {
  /**
   * Sends password reset link to user
   * @param:email and token
   * @return:sends email to user
   */
  const resetURL = `https://accesskeymanager.onrender.com/reset-password/${token}`;
  const message = `<p>Please reset password by clicking on the following link :
  <a href="${resetURL}">Reset Password</a></p>`;

  return await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${email}</h4>
   ${message}
   `,
  });
};

const sendEmailVerification = async ({ email, verificationToken }) => {
  /**
   * Send email verification token to user
   * @param:email, and verificationToken
   * return:Send an email to user
   */
  const verifyEmail = `https://accesskeymanager.onrender.com/verify-email/${verificationToken}`;
  console.log(verifyEmail);

  const message = `<p>Please confirm your email by clicking on the following link :
    <a href="${verifyEmail}">Verify Email</a> </p>`;
  console.log(message);

  return await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${email}</h4>
      ${message}
      `,
  });
};

module.exports = { sendResetPasswordEmail, sendEmailVerification };
