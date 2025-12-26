import mongoose from "mongoose";
import { compareValue, hashValue } from "../../utils/bcrypt/hash.js";
 
const RegistrationSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    alternateEmail: { type: String },
    phone: { type: String },
    alternatePhone: { type: String },
    companyName: { type: String },
    domainName: { type: String },
 
    otp: {
      type: String,
    },
 
    otpExpiresAt: {
      type: Date,
    },
 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);
 
 
RegistrationSchema.pre("save", function () {
  if (this.otpExpiresAt && this.otpExpiresAt < new Date()) {
    this.otp = null;
    this.otpExpiresAt = null;
  }
});
 
RegistrationSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  this.otp = await hashValue(this.otp, 10);
});
 
 
RegistrationSchema.methods.compareOTP = function (otp) {
  return compareValue(otp, this.otp);
};
 
export const Registration = mongoose.model("Registration", RegistrationSchema);
 