import express from "express";
import registrationRoutes from "./clientRegistration/registration_routes.js";
import adminRoutes from "../routers/cholaAdmin/admin_routes.js";
import { otpRouter } from "./otp/otp_routes.js";
import { authRouter } from "./chola_client/auth_routes.js";

const router = express.Router();

router.use("/v1", registrationRoutes);
router.use("/v1", adminRoutes);
router.use("/v1", otpRouter);

//client authRouter 
router.use("/v1", authRouter);



export default router;
