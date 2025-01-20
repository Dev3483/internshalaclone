const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const useragent = require("useragent");
const geoip = require("geoip-lite");
const cloudinary = require("./cloudinaryConfig");
const { connect } = require("./db");
const router = require("./Routes/index");
const userRoutes = require("./Routes/UserRoutes");
const User = require("./Model/User");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Nodemailer setup for OTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// User Schema and Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  loginHistory: [
    {
      browser: String,
      os: String,
      device: String,
      ip: String,
      loginTime: Date,
      otpVerified: { type: Boolean, default: false },
    },
  ],
});
// const User = mongoose.model("User", UserSchema);

// Routes
app.post("/login", async (req, res) => {
  const { email } = req.body;
  const agent = useragent.parse(req.headers["user-agent"]);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  const currentTime = new Date();
  const hours = currentTime.getHours();

  const deviceType = agent.device.toJSON().family === "Other" ? "Desktop" : "Mobile";
  const loginAllowed =
    deviceType === "Mobile" ? hours >= 10 && hours <= 13 : true;

  if (!loginAllowed) {
    return res
      .status(403)
      .json({ message: "Mobile access allowed only from 10 AM to 1 PM" });
  }

  const otp = generateOTP();

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, loginHistory: [] });
    }

    const loginData = {
      browser: agent.family,
      os: agent.os.toString(),
      device: deviceType,
      ip: geo ? geo.city || "Unknown Location" : ip,
      loginTime: currentTime,
    };

    user.loginHistory.push(loginData);
    await user.save();

    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email", otp });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const latestLogin = user.loginHistory[user.loginHistory.length - 1];
    if (!latestLogin) {
      return res.status(400).json({ error: "No login record found" });
    }

    latestLogin.otpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/login-history/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ loginHistory: user.loginHistory });
  } catch (error) {
    console.error("Fetch Login History Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/", async (req, res) => {
  const { image } = req.body;

  try {
    const uploadImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "internshala",
        allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "ico", "webp", "jfif"],
      },
      function (error, result) {
        if (error) console.log(error);
        console.log(result);
      }
    );

    res.status(200).json(uploadImage);
  } catch (err) {
    console.error("Upload failed:", err);
  }
});

// Additional routes
app.use("/api", userRoutes);
app.use("/api", router);

// Connect to Database
connect();

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Server Running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
