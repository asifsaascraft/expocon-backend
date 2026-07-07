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
  "/auth/register/admin": {
    post: {
      tags: ["Authentication"],
      summary: "Register Admin",
      description:
        "Register the first and only admin account. After successful registration, a verification email is sent.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterAdminRequest",
            },

            example: registerAdminExample,
          },
        },
      },

      responses: {
        201: {
          description: "Admin registered successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Admin registered successfully. Please verify your email.",

                data: {
                  id: "6852b4d04ef5f2e4dbd0d001",

                  fullName: "Super Admin",

                  email: "admin@example.com",

                  role: "admin",

                  status: "pending",
                },
              },
            },
          },
        },

        400: badRequest400,

        409: conflict409,

        500: internalServer500,
      },
    },
  },

  "/auth/verify-email/{token}": {
    get: {
      tags: ["Authentication"],

      summary: "Verify Email",

      description: "Verify user email using verification token.",

      parameters: [
        {
          name: "token",

          in: "path",

          required: true,

          schema: {
            type: "string",
          },

          description: "Email verification token.",
        },
      ],

      responses: {
        200: {
          description: "Email verified successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Email verified successfully.",
              },
            },
          },
        },

        400: badRequest400,

        404: notFound404,

        500: internalServer500,
      },
    },
  },

  "/auth/resend-verification-email": {
    post: {
      tags: ["Authentication"],

      summary: "Resend Verification Email",

      description:
        "Send a new email verification link if the account is not yet verified.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["email"],

              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
              },
            },

            example: resendVerificationEmailExample,
          },
        },
      },

      responses: {
        200: {
          description: "Verification email sent.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "If an account exists and is not verified, a verification email has been sent.",
              },
            },
          },
        },

        400: badRequest400,

        500: internalServer500,
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Authentication"],

      summary: "Login",

      description:
        "Login using email and password. Returns access token and refresh token cookie.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginRequest",
            },

            example: loginExample,
          },
        },
      },

      responses: {
        200: {
          description: "Login successful.",

          content: {
            "application/json": {
              example: loginSuccessExample,
            },
          },
        },

        400: badRequest400,

        401: unauthorized401,

        403: forbidden403,

        500: internalServer500,
      },
    },
  },
  
    "/auth/refresh-token": {
    post: {
      tags: ["Authentication"],

      summary: "Refresh Access Token",

      description:
        "Generate a new access token using the refresh token stored in the HTTP-only cookie.",

      responses: {
        200: {
          description: "Access token refreshed successfully.",

          content: {
            "application/json": {
              schema: {
                $ref:
                  "#/components/schemas/RefreshTokenResponse",
              },

              example: {
                success: true,

                message:
                  "Access token refreshed successfully.",

                data: {
                  accessToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.xxx",
                },
              },
            },
          },
        },

        401: unauthorized401,

        500: internalServer500,
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Authentication"],

      summary: "Logout",

      description:
        "Logout from the current device by invalidating the current session.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Logged out successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Logged out successfully.",
              },
            },
          },
        },

        401: unauthorized401,

        500: internalServer500,
      },
    },
  },

  "/auth/logout-all": {
    post: {
      tags: ["Authentication"],

      summary: "Logout From All Devices",

      description:
        "Logout the authenticated user from all active devices and sessions.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description:
            "Logged out from all devices successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Logged out from all devices successfully.",
              },
            },
          },
        },

        401: unauthorized401,

        500: internalServer500,
      },
    },
  },

    "/auth/forgot-password": {
    post: {
      tags: ["Authentication"],

      summary: "Forgot Password",

      description:
        "Send a password reset link to the registered email address if the account exists.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/ForgotPasswordRequest",
            },

            example: forgotPasswordExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Password reset email processed.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "If an account exists with this email, a password reset link has been sent.",
              },
            },
          },
        },

        400: badRequest400,

        500: internalServer500,
      },
    },
  },

  "/auth/reset-password/{token}": {
    post: {
      tags: ["Authentication"],

      summary: "Reset Password",

      description:
        "Reset password using the reset token received in the email.",

      parameters: [
        {
          name: "token",

          in: "path",

          required: true,

          description: "Password reset token.",

          schema: {
            type: "string",
          },
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref:
                "#/components/schemas/ResetPasswordRequest",
            },

            example: resetPasswordExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Password reset successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Password reset successfully. Please login again.",
              },
            },
          },
        },

        400: badRequest400,

        404: notFound404,

        500: internalServer500,
      },
    },
  },

};

export default authPaths;
