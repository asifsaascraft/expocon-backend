import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import UserSession from "../models/UserSession.js";
import hashToken from "./hashToken.js";

const generateTokens = async ({ user, req, deviceInfo = {} }) => {
  // Session ID

  const sessionId = uuidv4();

  // Access Token

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "15m",
    },
  );

  // Refresh Token

  const refreshToken = jwt.sign(
    {
      id: user._id,
      sessionId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
    },
  );

  // Hash Refresh Token

  const refreshTokenHash = hashToken(refreshToken);

  // Refresh Token Expiry

  const decodedRefresh = jwt.decode(refreshToken);

  const expiresAt = new Date(decodedRefresh.exp * 1000);

  // Save Session

  await UserSession.create({
    user: user._id,

    sessionId,

    refreshTokenHash,

    deviceId: deviceInfo.deviceId || null,

    deviceName: deviceInfo.deviceName || null,

    browser: deviceInfo.browser || null,

    operatingSystem: deviceInfo.operatingSystem || null,

    platform: deviceInfo.platform || null,

    appVersion: deviceInfo.appVersion || null,

    ipAddress: req.ip,

    location: deviceInfo.location || null,

    userAgent: req.headers["user-agent"],

    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    sessionId,
  };
};

export default generateTokens;
