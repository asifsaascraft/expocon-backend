import {
  registerAdminExample,
  loginExample,
  forgotPasswordExample,
  resetPasswordExample,
  resendVerificationEmailExample,
  loginSuccessExample,
} from "./examples.js";

import {
  success200,
  created201,
  badRequest400,
  unauthorized401,
  forbidden403,
  notFound404,
  conflict409,
  internalServer500,
} from "./responses.js";

const authPaths = {
  // your swagger paths
};

export default authPaths;