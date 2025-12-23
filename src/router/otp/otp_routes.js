import express from "express";
import { generateOtp, resendOtp, verifyOtp } from "../../controller/otp/otp_controller.js";

export const otpRouter = express.Router();

otpRouter.get("v1/generateotp",generateOtp)
otpRouter.post("v1/verifyotp/:token",verifyOtp)
otpRouter.post("v1/resendotp",resendOtp)

