
import { verifyToken } from "../../utils/jwt/verifyToken.js";

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.admin = decoded;+


    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

