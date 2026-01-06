import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";

export const getCholaClientUser = async (req, res) => {
    const user = req.user.toObject();

    delete user?.otp;
    delete user?.otpExpiresAt;
    delete user?.isEmailVerified;
    delete user?._id;

    try {
      if (!user) {
        return res.json(new ApiResponse(404, null, "User not recognized"));
      }
        return res.json(new ApiResponse(200, user, "User retrieved successfully"));
    } catch (error) {
      console.error(error);
      return res.json(new ApiResponse(500, {}, "Internal Server Error"));
    }
}