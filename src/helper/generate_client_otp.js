import { Registration } from "../model/clientRegistration/registraion_model.js";
import { generateOtp } from "../utils/otp/generate_otp.js";


export const generateClientOTP = async(email) => {
    const exists = await Registration.findOne({ email });

    if (!exists) {
      return 404, {}, "User not exists"
    }

    const newOtp = generateOtp();
    console.log("newOtp :", newOtp);

    if (!newOtp) {
      return 500, {}, "OTP generation failed"
    }

    const payload = {
      id: exists._id,
      email: exists?.email,
    };

    const token = generateToken(payload, process.env.OTP_TOKEN, "5m");

    if (!token) {
      return 500, {}, "Token generation failed";
    }

    ret
}