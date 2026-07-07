// utils/hashToken.js

import crypto from "crypto";

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export default hashToken;