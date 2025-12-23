import jwt from "jsonwebtoken";
import { Admin } from "../../model/cholaAdmin/admin_model.js";

/* =========================
   Admin Register
========================= */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      adminId: admin._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
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
    res.status(500).json({ message: error.message });
  }
};
