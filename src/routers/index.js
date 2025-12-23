import express from "express";
import registrationRoutes from "./clientRegistration/registration_routes.js";
import adminRoutes from "./cholaAdmin/admin_routes.js";

const router = express.Router();



router.use("/v1", registrationRoutes);
router.use("/v1", adminRoutes);



export default router;
