import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { compareValue } from "../../utils/bcrypt/hash.js";

export const clientLogin = async (req, res) => {
  const user = req.user;
  const otp = req.body?.otp || req.query?.otp;
  try {
    if (!user) {
      return res.json(new ApiResponse(404, null, "User not recognized"));
    }
    if (!otp) {
      return res.json(
        new ApiResponse(400, null, "OTP required, please enter OTP")
      );
    }
    if (Date.now() > user.otpExpiresAt) {
      return res.json(new ApiResponse(404, null, "OTP expired"));
    }

    const isvalid = await compareValue(String(otp), user.otp);
    console.log("isvalid :", isvalid);

    if (!isvalid) {
      return res.json(new ApiResponse(404, null, "OTP not match"));
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const payload = {
      id: user._id,
      email: user?.email,
    };

    const token = generateToken(payload, process.env.OTP_TOKEN, "1d");

    if (!token) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Token generation failed"));
    }
    return res.json(new ApiResponse(200, token,user, "user login successfully"));
  } catch (error) {
    console.error(error);
    return res.json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};
