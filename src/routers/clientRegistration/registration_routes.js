import express from "express";
import {createRegistrationLink,validateRegistrationLink,cholaClientRegistration,verifyRegistrationOtp}from "../../controllers/clientRegistration/registration_controller.js";
import { adminAuth } from "../../middleware/cholaAdmin/adminAuth.js";
const router = express.Router();


router.post("/create",adminAuth, createRegistrationLink);
router.get("/:token",validateRegistrationLink);
router.post("/:token", cholaClientRegistration);
router.post("/:token/verify-otp", verifyRegistrationOtp);

export default router;
