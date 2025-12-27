import mongoose from "mongoose";
import { hashValue } from "../../utils/bcrypt/hash.js";

const RegistrationSchema = new mongoose.Schema(
  {
    uuid: { type: String,
      //  required: true, unique: true
       },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    alternateEmail: { type: String },
    phone: { type: String },
    alternatePhone: { type: String },
    companyName: { type: String },
    domainName: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
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
export const Registration = mongoose.model("Registration", RegistrationSchema);
