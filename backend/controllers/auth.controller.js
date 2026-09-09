import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import { sendEmail } from "../lib/email.js";
import { RESET_CODE_TEMPLATE } from "../templates/emailTemplates.js";

const clean = (val) => val || "";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    // Only ONE admin account allowed - ever
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ error: "Admin account already exists" });
    }
    const passwordRegex = /^[A-Z][a-z]+_[a-z]+\d$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
    });
    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.log("Signup Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isCorrect = await bcrypt.compare(password.trim(), user.password);
    if (!isCorrect) return res.status(400).json({ error: "Invalid credentials" });
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    // Never reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        message: "If an admin account exists with this email, a reset code has been sent.",
      });
    }
    
    const resetCode = crypto.randomInt(100000, 1000000).toString();
    user.passwordResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;
    await user.save();
    
    try {
      // SAFE REPLACEMENT: Explicitly stringify variables to ensure replaceAll does not choke
      const safeName = String(user.fullName || "User");
      const safeCode = String(resetCode);
      
      const emailHtml = RESET_CODE_TEMPLATE
        .replaceAll("{fullName}", safeName)
        .replaceAll("{resetCode}", safeCode);

      await sendEmail({
        to: user.email,
        subject: "Admin Password Reset Code - CinemaLux",
        html: emailHtml,
      });
    } catch (err) {
      user.passwordResetCode = null;
      user.passwordResetExpires = null;
      await user.save();
      throw err;
    }
    
    return res.status(200).json({
      message: "If an admin account exists with this email, a reset code has been sent.",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required" });
    }
    const hashedCode = crypto.createHash("sha256").update(String(code)).digest("hex");
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      passwordResetCode: hashedCode,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }
    user.passwordResetVerified = true;
    await user.save();
    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.log("Verify Reset Code Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const passwordRegex = /^[A-Z][a-z]+_[a-z]+\d$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      passwordResetVerified: true,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ error: "Password reset session is invalid or expired" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.log("Reset Password Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};