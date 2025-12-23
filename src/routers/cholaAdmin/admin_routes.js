import express from "express";
import {
  registerAdmin,
  loginAdmin,
} from "../../controllers/cholaAdmin/admin_controller.js";
import { adminAuth } from "../../middleware//cholaAdmin/adminAuth.js";

const router = express.Router();

/* Auth */
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

/* Protected Example */
router.get("/admin/profile", adminAuth, (req, res) => {
  res.json({
    success: true,
    message: "Admin authorized",
    admin: req.admin,
  });
});

export default router;
