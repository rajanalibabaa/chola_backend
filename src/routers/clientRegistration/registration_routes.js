import express from "express";
import {cholaClientRegistration}from "../../controllers/clientRegistration/registration_controller.js";
import { adminAuth } from "../../middleware/cholaAdmin/adminAuth.js";
const router = express.Router();


router.post("/registration/", cholaClientRegistration);

export default router;
