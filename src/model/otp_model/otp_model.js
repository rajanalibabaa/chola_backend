import mongoose from "mongoose";
import { hashValue, compareValue } from "../../utils/bcrypt/hash.js";

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Hash OTP before saving
OtpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  this.otp = await hashValue(this.otp, 10);
});

export const OTP = mongoose.model("OTP", OtpSchema);
