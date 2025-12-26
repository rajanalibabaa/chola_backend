import { Registration } from "../../model/clientRegistration/registraion_model.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { verifyToken } from "../../utils/jwt/verifyToken.js";

export const verify_otp_token = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.query?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, null, "Token not found, Unauthorized request")
      );
    }

    const { valid, expired, decoded } = verifyToken(token, process.env.OTP_TOKEN);

    if (expired) {
      return res.status(401).json(
        new ApiResponse(401, null, "Token expired, please request a new OTP")
      );
    }

    if (!valid) {
      return res.status(401).json(
        new ApiResponse(401, null, "Unauthorized request, invalid token")
      );
    }

    const user = await Registration.findById(decoded.id);
    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, "User not found")
      );
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verify_otp_token:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error while verifying token")
    );
  }
};
