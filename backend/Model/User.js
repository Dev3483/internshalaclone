const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional: For password-based authentication
    profilePicture: { 
      type: String, 
      default: "" // Default profile image URL
    },
    cloudinaryPublicId: { type: String, default: "" }, // For Cloudinary public_id
    otp: { type: String, default: null }, // Temporary storage for OTP
    otpExpiry: { type: Date, default: null }, // Expiry time for OTP
    loginHistory: [
      {
        browser: { type: String },
        os: { type: String },
        device: { type: String },
        ip: { type: String },
        loginTime: { type: Date, default: Date.now },
        otpVerified: { type: Boolean, default: false }, // Whether OTP was verified during login
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
