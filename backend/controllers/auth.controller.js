import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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

    res
      .status(200)
      .json({
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
  res.send("login");
}

export async function logout(req, res) {
  res.send("logout");
}
