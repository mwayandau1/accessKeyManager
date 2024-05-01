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

  return await transporter.sendMail({
    from: '"Micro Focus Inc." <microfocusin@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

const sendResetPasswordEmail = async ({ name, email, token }) => {
  const resetURL = `https://accesskeymanager.onrender.com/reset-password/${token}`;
  //const resetURL = `http://127.0.0.1:5173/reset-password/${token}`;
  console.log(resetURL);
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

const sendEmailVerification = async ({ email, verificationToken, origin }) => {
  const verifyEmail = `${origin}/verify-email/${verificationToken}`;
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
