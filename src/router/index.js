import express from "express";
import registrationRoutes from "./clientRegistration/registration_router.js";
import adminRoutes from "";

const router = express.Router();

router.use("/registration", registrationRoutes);
router.use("/admin", adminRoutes);

export default router;
