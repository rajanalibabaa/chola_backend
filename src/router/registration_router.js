import express from "express";
import {createRegistrationLink,validateRegistrationLink,submitRegistrationForm,verifyRegistrationOtp}from "../controller/registration_controller.js";
const router = express.Router();


router.post("/create", createRegistrationLink);
router.get("/:token",validateRegistrationLink);
router.post("/:token", submitRegistrationForm);
router.post("/:token/verify-otp", verifyRegistrationOtp);

export default router;
