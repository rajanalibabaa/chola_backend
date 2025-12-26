import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
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
  },
  { timestamps: true }
);

export const Registration = mongoose.model("Registration", RegistrationSchema);
