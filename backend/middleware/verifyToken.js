import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized | No token provided." });

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    if (!decoded)
      res
        .status(401)
        .json({ success: false, message: "Unauthorized | Invalid token." });

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("verify token error", error);

    res.status(500).json({ success: false, message: "Server Error" });
  }
}
