import crypto from "crypto";
import User from "../models/User.js";

const generateUsername = async (fullName) => {
  // Remove spaces and special characters
  const base = fullName.toLowerCase().replace(/[^a-z0-9]/g, "");

  let username;
  let exists = true;

  while (exists) {
    const random = crypto.randomBytes(3).toString("hex");

    username = `${base}${random}`;

    exists = await User.exists({
      username,
    });
  }

  return username;
};

export default generateUsername;
