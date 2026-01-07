import { sendEmail } from "../../config/email.js";
import { Registration } from "../../model/clientRegistration/registraion_model.js";
import { otpEmailTemplate } from "../../template/otpEmailTemplate.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { compareValue, hashValue } from "../../utils/bcrypt/hash.js";
import { generateToken } from "../../utils/jwt/generateToken.js";
import { generateOtp } from "../../utils/otp/generate_otp.js";
import { getExpiryTime } from "../../utils/time/time_utils.js";
import { OTP } from "../../model/otp_model/otp_model.js";

export const sendOtp = async (req, res) => {
  try {
    const email = req.body?.email || req.query?.email;

    if (!email) {
      return res.json(new ApiResponse(400, {}, "Email is required"));
    }

    const exists = await Registration.findOne({ email });

    if (!exists) {
      return res.json(new ApiResponse(404, {}, "User not exists"));
    }

    const newOtp = generateOtp();
    
    console.log("newOtp :",newOtp)

    if (!newOtp) {
      return res.json(new ApiResponse(500, {}, "OTP generation failed"));
    }

    const payload = {
      id: exists._id,
      email: exists?.email,
    };

    const token = generateToken(payload, process.env.OTP_TOKEN, "5m");

    if (!token) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Token generation failed"));
    }

    const expiresAt = getExpiryTime(5);
    exists.otp = newOtp;
    exists.otpExpiresAt = expiresAt;

    await exists.save();

    await sendEmail({
      to: email,
      subject: "OTP Verification – MrFranchise",
      html: otpEmailTemplate("Chola client", newOtp),
    });

    return res.json(new ApiResponse(200, { token }, "OTP sent successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const verifyOtp = async (req, res) => {
  const user = req.user;
  const otp = req.body?.otp || req.query?.otp;
  if (!user) {
    return res.json(new ApiResponse(404, null, "User not recognized"));
  }
  if (!otp) {
    return res.json(
      new ApiResponse(400, null, "OTP required, please enter OTP")
    );
  }
  if (Date.now() > user.otpExpiresAt) {
    return res.json(new ApiResponse(404, null, "OTP expired"));
  }

  const isvalid = await compareValue(String(otp), user.otp);
 

  if (!isvalid) {
    return res.json(new ApiResponse(404, null, "OTP not match"));
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  return res.json(new ApiResponse(200, null, "OTP verified successfully"));
};

export const sendOrResendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    

    if (!email) {
      return res.json(new ApiResponse(400, null, "Email is required"));
    }

    // Block if already registered
    const userExists = await Registration.findOne({ email });
    if (userExists) {
      return res.json(
        new ApiResponse(409, null, "User already registered")
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpiresAt = getExpiryTime(5);

    if (!otp) {
      return res.json(
        new ApiResponse(500, null, "OTP generation failed")
      );
    }

    const hashedOtp  = await hashValue(otp, 10);
    // Create or Update OTP
    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOtp, otpExpiresAt },
      { upsert: true, new: true }
    );

    // Send email
    await sendEmail({
      to: email,
      subject: "Verify your email – MrFranchise",
      html: `Your OTP is <b>${otp}</b>. It expires in 5 minutes.`,
    });

    return res.json(
      new ApiResponse(200, null, "OTP sent successfully")
    );
  } catch (error) {
    console.error(error);
    return res.json(
      new ApiResponse(500, null, "Internal Server Error")
    );
  }
};

export const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json(new ApiResponse(400, null, "Email and OTP are required"));
    }

    // Find OTP record
    const otpDoc = await OTP.findOne({ email });

    // Check expiry
    if (otpDoc.otpExpiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.json(new ApiResponse(410, null, "OTP expired"));
    }

    // Compare OTP
    const isValid = await compareValue(otp, otpDoc.otp);
    if (!isValid) {
      return res.json(new ApiResponse(401, null, "Invalid OTP"));
    }

    // OTP SUCCESS → delete OTP
    await OTP.deleteOne({ email });

    return res.json(new ApiResponse(200, null, "Email verified successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

