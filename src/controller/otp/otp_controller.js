import { sendEmail } from "../../config/email.js";
import { Registration } from "../../model/registraionSchema_model.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { generateToken } from "../../utils/jwt/generateToken.js";
import { generateOtp } from "../../utils/otp/generate_otp.js";
import { getExpiryAfter5Minutes } from "../../utils/time/time_utils.js";

export const sendOtp = async (res, req) => {
  const email = req.body.email || req.query.email;

  const exists = await Registration.findOne({ email });

  if (!exists) {
    return res.json(new ApiResponse(404, {}, "User not exists"));
  }

  const newOtp = generateOtp();

  if (!newOtp) {
    return res.json(new ApiResponse(404, {}, " OTP generation failed"));
  }
  const payload = {
    id: exists._id,
    email: exists.email,
  };
  const token = generateToken(payload, process.env.OTP_TOKEN, "5m");

  if (!token) {
    return res.json(new ApiResponse(404, {}, " Token generation failed"));
  }
  res.cookie(token, {
    httpOnly: true,
    secure: true, 
    sameSite: "strict",
  });

  exists.otp = newOtp
  exists.expiresAt = getExpiryAfter5Minutes(5)

  const update = exists.save()

  if (!update) {
    return res.json(new ApiResponse(500, {}, " OTP saving failed"));
  }

  await sendEmail(exists.email,"OTP")

  
  

};
export const verifyOtp = async () => {};
export const resendOtp = async () => {};
