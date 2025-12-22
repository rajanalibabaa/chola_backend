export const otpEmailTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif">
      <h2>Email Verification OTP</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your OTP for completing registration is:</p>

      <h1 style="letter-spacing: 4px">${otp}</h1>

      <p>This OTP is valid for <strong>10 minutes</strong>.</p>

      <p>If you did not request this, please ignore.</p>

      <br />
      <p>Regards,<br/><strong>MrFranchise Team</strong></p>
    </div>
  `;
};
