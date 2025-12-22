import crypto from "crypto";
import {RegistrationLink} from "../model/registraionLinkSchema_model.js";
import { generateOtp, hashOtp } from "../utils/otp/generate_otp.js";
import { sendEmail } from "../config/email.js";
import { otpEmailTemplate } from "../template/otpEmailTemplate.js";


export const createRegistrationLink = async (req, res) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    const link = await RegistrationLink.create({
      token,
      expiresAt,
      createdBy: req.user?.id, // admin id
    });

    const registrationUrl = `${process.env.FRONTEND_URL}/register/${token}`;

    res.status(201).json({
      success: true,
      registrationUrl,
      expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateRegistrationLink = async (req, res) => {
  try {
    const { token } = req.params;

    const link = await RegistrationLink.findOne({ token });

    if (!link)
      return res.status(404).json({ message: "Invalid link" });

    if (link.isUsed)
      return res.status(400).json({ message: "Link already used" });

    if (link.expiresAt < new Date())
      return res.status(400).json({ message: "Link expired" });

    res.status(200).json({
      success: true,
      message: "Link valid",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitRegistrationForm = async (req, res) => {
  try {
    const { token } = req.params;
    const {
      name,
      email,
      alternateEmail,
      phone,
      alternatePhone,
      companyName,
      domainName,
    } = req.body;

    const link = await RegistrationLink.findOne({ token });

    if (!link) return res.status(404).json({ message: "Invalid link" });
    if (link.isUsed) return res.status(400).json({ message: "Link already used" });
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

export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { token } = req.params;
    const { otp } = req.body;

    const link = await RegistrationLink
      .findOne({ token })
      .select("+otp");

    if (!link)
      return res.status(404).json({ message: "Invalid link" });

    if (!link.otp || !link.otpExpiresAt)
      return res.status(400).json({ message: "OTP not found" });

    if (link.otpExpiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== link.otp)
      return res.status(400).json({ message: "Invalid OTP" });

    /* OTP verified */
    link.isOtpVerified = true;
    link.otp = undefined;
    link.otpExpiresAt = undefined;

    await link.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
