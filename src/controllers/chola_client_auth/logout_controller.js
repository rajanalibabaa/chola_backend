import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";

export const clientLogout = async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,       
      sameSite: "strict",
    });

    return res.json(
      new ApiResponse(200, null, "User logged out successfully")
    );
  } catch (error) {
    console.error("Logout error:", error);
    return res.json(
      new ApiResponse(500, null, "Internal Server Error")
    );
  }
};
