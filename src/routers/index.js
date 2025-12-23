import express from "express";
import registrationRoutes from "./clientRegistration/registration_routes.js";
import adminRoutes from "./cholaAdmin/admin_routes.js";
import { otpRouter } from "./otp/otp_routes.js";

const router = express.Router();



router.use("/v1", registrationRoutes);
router.use("/v1", adminRoutes);
router.use("/v1", otpRouter);



export default router;
