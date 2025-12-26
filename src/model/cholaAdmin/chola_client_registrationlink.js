import mongoose from "mongoose";

const RegistrationLinkSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      // required: true,
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

        /* OTP Fields */
    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: String,
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
RegistrationLinkSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);
export const RegistrationLink = mongoose.model("RegistrationLink",RegistrationLinkSchema);
