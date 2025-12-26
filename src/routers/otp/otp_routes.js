import express from "express";
import {  sendRegistrationOtp, verifyOtp } from "../../controllers/otp/otp_controller.js";
import { verify_client_token } from "../../middleware/chola_client_auth/verify_client_token_middleware.js";

export const otpRouter = express.Router();

otpRouter.post("/otp/send",sendRegistrationOtp)
otpRouter.post("/verify/otp",verify_client_token ,verifyOtp)
// otpRouter.post("/resendotp",resendOtp)




