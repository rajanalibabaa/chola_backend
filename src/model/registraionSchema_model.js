import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      // index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    /* Form Data (filled by user) */
    name: String,
    email: String,
    alternateEmail: String,
    phone: String,
    alternatePhone: String,
    companyName: String,
    domainName: String,

        /* OTP Fields */
    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

/* Auto delete expired links (MongoDB TTL) */
RegistrationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
export const Registration = mongoose.model("Registration",RegistrationSchema);
