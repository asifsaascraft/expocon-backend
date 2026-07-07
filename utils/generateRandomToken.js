import crypto from "crypto";

/**
 * Generate secure random token
 *
 * @param {number} bytes - Token length in bytes
 * @returns {{
 *   rawToken: string,
 *   hashedToken: string
 * }}
 */

const generateRandomToken = (bytes = 32) => {
  // Token sent to user
  const rawToken = crypto.randomBytes(bytes).toString("hex");

  // Token stored in database
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

export default generateRandomToken;