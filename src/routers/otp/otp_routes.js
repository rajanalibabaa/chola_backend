import express from "express";
import {  sendOtp, sendOrResendRegistrationOtp, verifyOtp, verifyRegistrationOtp } from "../../controllers/otp/otp_controller.js";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";

export const otpRouter = express.Router();

otpRouter.post("/otp/send",sendOtp)
otpRouter.post("/verify/otp",verify_client_token ,verifyOtp)
otpRouter.post("/otp/reg-send-resend",sendOrResendRegistrationOtp)
otpRouter.post("/otp/reg-verify",verifyRegistrationOtp)



    

