import { Admin } from "../../model/cholaAdmin/admin_model.js";
import {generateToken} from "../../utils/jwt/generateToken.js";

/* =========================
   Admin Register
========================= */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin registration failed",
      error: error.message,
    });
  }
};


/* =========================
   Admin Login
========================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin)
       return res.status(401).json({ message: "Invalid credentials" });

    if (!admin.isActive)
      return res.status(403).json({ message: "Admin account disabled" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      id: admin._id,
      role: admin.role,
    }
    const token = generateToken(payload,process.env.JWT_SECRET,'1d');

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
