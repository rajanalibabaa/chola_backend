import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {

  console.log("Sending email to :",to)
  console.log("Email subject :",subject)
  console.log("Email html :",html)
  await transporter.sendMail({
    from: `"MrFranchise" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
