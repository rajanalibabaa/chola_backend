export const otpEmailTemplate = ( name, otp ) => {
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


export const otpEmailTemplate2 = (name, otp) => {
  return `
    <div style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
      
      <div style="background:#0f172a;padding:20px;text-align:center;color:#ffffff">
        <h2 style="margin:0;">Email Verification</h2>
      </div>

      <div style="padding:24px;color:#111827">
        <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>

        <p style="font-size:14px;line-height:1.6;">
          Thank you for registering with <strong>MrFranchise</strong>.
          Please use the One-Time Password (OTP) below to verify your email address.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <span style="
            display:inline-block;
            padding:14px 24px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#0f172a;
            background:#f1f5f9;
            border-radius:6px;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px;">
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="font-size:13px;color:#6b7280;">
          If you didn’t request this verification, you can safely ignore this email.
        </p>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />

        <p style="font-size:14px;">
          Regards,<br />
          <strong>MrFranchise Team</strong>
        </p>
      </div>
    </div>
  `;
};

