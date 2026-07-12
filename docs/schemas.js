export const schemas = {
  User: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "6852b4d04ef5f2e4dbd0d001",
      },

      fullName: {
        type: "string",
        example: "John Doe",
      },

      username: {
        type: "string",
        example: "johndoe",
      },

      email: {
        type: "string",
        example: "john@example.com",
      },

      mobile: {
        type: "string",
        example: "9876543210",
      },

      profileImage: {
        type: "string",
        nullable: true,
        example: null,
      },

      role: {
        type: "string",
        enum: ["admin", "user", "partner", "staff"],
        example: "user",
      },

      status: {
        type: "string",

        enum: ["pending", "active", "blocked"],

        example: "active",
      },

      isDeleted: {
        type: "boolean",
        example: false,
      },

      isEmailVerified: {
        type: "boolean",
        example: true,
      },

      language: {
        type: "string",
        example: "en",
      },

      timezone: {
        type: "string",
        example: "Asia/Kolkata",
      },

      loginCount: {
        type: "integer",
        example: 12,
      },

      lastLoginAt: {
        type: "string",
        format: "date-time",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  UserSession: {
    type: "object",

    properties: {
      sessionId: {
        type: "string",
      },

      deviceId: {
        type: "string",
      },

      deviceName: {
        type: "string",
      },

      browser: {
        type: "string",
      },

      operatingSystem: {
        type: "string",
      },

      platform: {
        type: "string",
      },

      appVersion: {
        type: "string",
      },

      ipAddress: {
        type: "string",
      },

      location: {
        type: "string",
      },

      isActive: {
        type: "boolean",
      },

      lastActivityAt: {
        type: "string",
        format: "date-time",
      },

      expiresAt: {
        type: "string",
        format: "date-time",
      },

      loggedOutAt: {
        type: "string",
        nullable: true,
        format: "date-time",
      },
    },
  },

  CompanyType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      companyTypeName: {
        type: "string",
        example: "Hospital",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  State: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      state: {
        type: "string",
        example: "Uttar Pradesh",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  RegisterAdminRequest: {
    type: "object",

    required: ["fullName", "email", "password"],

    properties: {
      fullName: {
        type: "string",
      },

      username: {
        type: "string",
      },

      email: {
        type: "string",
      },

      mobile: {
        type: "string",
      },

      password: {
        type: "string",
      },
    },
  },

  RegisterUserRequest: {
    type: "object",

    required: ["fullName", "email", "password"],

    properties: {
      fullName: {
        type: "string",
      },

      username: {
        type: "string",
      },

      email: {
        type: "string",
      },

      mobile: {
        type: "string",
      },

      password: {
        type: "string",
      },
    },
  },
  RegisterPartnerRequest: {
    type: "object",

    required: ["fullName", "email", "password"],

    properties: {
      fullName: {
        type: "string",
      },

      username: {
        type: "string",
      },

      email: {
        type: "string",
      },

      mobile: {
        type: "string",
      },

      password: {
        type: "string",
      },
    },
  },

  UpdateProfileRequest: {
    type: "object",

    properties: {
      fullName: {
        type: "string",
        example: "John Doe",
      },

      username: {
        type: "string",
        example: "johndoe",
      },

      mobile: {
        type: "string",
        example: "9876543210",
      },

      language: {
        type: "string",
        example: "en",
      },

      timezone: {
        type: "string",
        example: "Asia/Kolkata",
      },
    },
  },

  ChangePasswordRequest: {
    type: "object",

    required: ["currentPassword", "newPassword"],

    properties: {
      currentPassword: {
        type: "string",
        example: "OldPassword@123",
      },

      newPassword: {
        type: "string",
        example: "NewPassword@123",
      },
    },
  },

  UploadProfileImageRequest: {
    type: "object",

    required: ["profileImage"],

    properties: {
      profileImage: {
        type: "string",
        format: "binary",
      },
    },
  },

  LoginRequest: {
    type: "object",

    required: ["email", "password"],

    properties: {
      email: {
        type: "string",
      },

      password: {
        type: "string",
      },
    },
  },

  ForgotPasswordRequest: {
    type: "object",

    required: ["email"],

    properties: {
      email: {
        type: "string",
      },
    },
  },

  ResetPasswordRequest: {
    type: "object",

    required: ["password"],

    properties: {
      password: {
        type: "string",
      },
    },
  },

  CreateCompanyTypeRequest: {
    type: "object",

    required: ["companyTypeName"],

    properties: {
      companyTypeName: {
        type: "string",
        example: "Hospital",
      },
    },
  },

  UpdateCompanyTypeRequest: {
    type: "object",

    required: ["companyTypeName"],

    properties: {
      companyTypeName: {
        type: "string",
        example: "Medical Equipment Company",
      },
    },
  },

  CreateStateRequest: {
    type: "object",

    required: ["state"],

    properties: {
      state: {
        type: "string",
        example: "Uttar Pradesh",
      },
    },
  },

  UpdateStateRequest: {
    type: "object",

    required: ["state"],

    properties: {
      state: {
        type: "string",
        example: "Maharashtra",
      },
    },
  },

  RefreshTokenResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
      },

      message: {
        type: "string",
      },

      data: {
        type: "object",

        properties: {
          accessToken: {
            type: "string",
          },
        },
      },
    },
  },

  SuccessResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
      },

      message: {
        type: "string",
      },

      data: {
        type: "object",
      },
    },
  },

  ErrorResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
      },

      message: {
        type: "string",
      },

      errors: {
        type: "object",
        nullable: true,
      },
    },
  },
};

export default schemas;
