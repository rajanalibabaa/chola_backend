import express from "express";
import { resendOtp, sendOtp, verifyOtp } from "../../controllers/otp/otp_controller.js";
import { verify_otp_token } from "../../middleware/otp/verifyOtp_middleware.js";

export const otpRouter = express.Router();

otpRouter.post("/otp/send",sendOtp)
otpRouter.post("/verify/otp",verify_otp_token ,verifyOtp)
otpRouter.post("/resendotp",resendOtp)

