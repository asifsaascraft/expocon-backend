import jwt from "jsonwebtoken";

import User from "../models/User.js";
import UserSession from "../models/UserSession.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Read Bearer Token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing.",
      });
    }

    // Verify JWT

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }

    // Find User

    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Soft Deleted User

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "This account has been deleted.",
      });
    }

    // Password Changed

    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: "Password changed recently. Please login again.",
      });
    }

    // Check Session

    const session = await UserSession.findOne({
      sessionId: decoded.sessionId,
      user: user._id,
    }).select("+refreshTokenHash");

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session not found.",
      });
    }

    // Session Active

    if (!session.isActive) {
      return res.status(401).json({
        success: false,
        message: "Session has been logged out.",
      });
    }

    // Session Expired

    if (session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session expired.",
      });
    }

    // Update Last Activity

    await session.touch();

    // Attach Request

    req.user = user;

    req.session = session;

    next();

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};

export default protect;