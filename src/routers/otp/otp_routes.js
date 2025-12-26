import express from "express";
import { resendOtp, sendOtp, verifyOtp } from "../../controllers/otp/otp_controller.js";

export const otpRouter = express.Router();

otpRouter.post("/otp/send",sendOtp)
otpRouter.post("/verifyotp/:token",verifyOtp)
otpRouter.post("/resendotp",resendOtp)




