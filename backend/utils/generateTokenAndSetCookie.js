import jwt from "jsonwebtoken";

export default function generateTokenAndSetCookie(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, //XSS Protection
    secure: process.env.NODE_ENV === "production", //HTTPS
    sameSite: "strict", //CSRF Protection
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 Days
  });

  return token;
}
