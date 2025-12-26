import { sendEmail } from "../../config/email.js";
import { Registration } from "../../model/clientRegistration/registraion_model.js";
import { otpEmailTemplate } from "../../template/otpEmailTemplate.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { compareValue } from "../../utils/bcrypt/hash.js";
import { generateToken } from "../../utils/jwt/generateToken.js";
import { generateOtp } from "../../utils/otp/generate_otp.js";
import { getExpiryTime } from "../../utils/time/time_utils.js";

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
    console.log("newOtp :", newOtp);

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
          html: otpEmailTemplate( "Chola client", newOtp ),
        });

    return res.json(new ApiResponse(200, { token, }, "OTP sent successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const verifyOtp = async (req, res) => {
  const user = req.user;
  const otp = req.body?.otp || req.query?.otp;
  try {
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
    console.log("isvalid :", isvalid);

    if (!isvalid) {
      return res.json(new ApiResponse(404, null, "OTP not match"));
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json(new ApiResponse(200, true, "OTP verified successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};
export const resendOtp = async (req, res) => {

};
