import crypto from "crypto";
import { Registration } from "../../model/clientRegistration/registraion_model.js";


export const cholaClientRegistration = async (req, res) => {
  try {
    const { token } = req.params || req.body;
    const {
      name,
      email,
      alternateEmail,
      phone,
      alternatePhone,
      companyName,
      domainName,
    } = req.body;

    const link = await Registration.findOne({ token });  

    if (!link) return res.status(404).json({ message: "Invalid link" });
    if (link.isUsed)
      return res.status(400).json({ message: "Link already used" });
    if (link.expiresAt < new Date())
      return res.status(400).json({ message: "Link expired" });

    /* Save form data */
    Object.assign(link, {
      name,
      email,
      alternateEmail,
      phone,
      alternatePhone,
      companyName,
      domainName,
      isUsed: true,
    });

    /* Generate OTP */
    const otp = generateOtp();

    link.otp = hashOtp(otp);
    link.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await link.save();

    /* Send OTP Email */
    await sendEmail({
      to: email,
      subject: "OTP Verification – MrFranchise",
      html: otpEmailTemplate({ name, otp }),
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to email. Please verify.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


