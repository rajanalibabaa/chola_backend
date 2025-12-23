import { sendEmail } from "../../config/email.js";
import { Registration } from "../../model/clientRegistration/registraion_model.js";
import { otpEmailTemplate } from "../../template/otpEmailTemplate.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { generateToken } from "../../utils/jwt/generateToken.js";
import { generateOtp } from "../../utils/otp/generate_otp.js";
import { getExpiryAfter5Minutes } from "../../utils/time/time_utils.js";

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
    // console.log("newotp :",newOtp)

    if (!newOtp) {
      return res.json(new ApiResponse(500, {}, "OTP generation failed"));
    }

    const payload = {
      id: exists._id,
      email: exists?.email,
    };

    // console.log("payload :",payload)

    const token = generateToken(payload, process.env.OTP_TOKEN, "5m");

    // console.log("token :",token)

    if (!token) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Token generation failed"));
    }

    const expiresAt = getExpiryAfter5Minutes(5);

    // console.log("expiresAt :",expiresAt)

    res.cookie("otp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresAt,
    });

    // console.log("cookie",req.cookies.otp_token)
    exists.otp = newOtp;
    exists.expiresAt = expiresAt;

    await exists.save();

    // await sendEmail({
    //       to: email,
    //       subject: "OTP Verification – MrFranchise",
    //       html: otpEmailTemplate({ email, newOtp }),
    //     });

    return res.json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const verifyOtp = async () => {};
export const resendOtp = async () => {};
