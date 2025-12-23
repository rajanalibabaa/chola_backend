import express from "express";
import {createRegistration,validateRegistration,submitRegistrationForm,verifyRegistrationOtp}from "../controller/registration_controller.js";
const router = express.Router();


router.post("/create", createRegistration);
router.get("/:token",validateRegistration);
router.post("/:token", submitRegistrationForm);
router.post("/:token/verify-otp", verifyRegistrationOtp);

export default router;
