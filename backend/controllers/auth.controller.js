import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import {
  sendForgotPasswordEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

export async function signup(req, res) {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required.");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken();

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 Hours
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      data: { ...user._doc, password: null },
      message: "User created.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function verifyEmail(req, res) {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid verification code or code has expired.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      data: { ...user._doc, password: null },
      message: "Email verified.",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, error: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw new Error("Both email and password is required.");

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials.");

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) throw new Error("Invalid password.");

    user.lastLogin = Date.now();

    generateTokenAndSetCookie(res, user._id);

    await user.save();

    res.status(201).json({
      success: true,
      data: { ...user._doc, password: null },
      message: "Successfully logged in.",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, message: error.message });
  }
}

export async function logout(req, res) {
  res.clearCookie("token");

  res.status(200).json({ success: true, message: "Successfully logged out." });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("An user with this email could not be found.");

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendForgotPasswordEmail(
      email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, message: error.message });
  }
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendPasswordResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Successfully reset password!" });
  } catch (error) {
    console.log(error);

    res.status(400).json({ success: false, message: error.message });
  }
}

export async function checkAuth(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found." });

    res.status(200).json({ success: true, data: { ...user._doc } });
  } catch (error) {
    console.log("error in checkAuth", error);

    res.status(400).json({ success: false, message: error.message });
  }
}
