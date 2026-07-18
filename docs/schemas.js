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

  AssociationType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      associationTypeName: {
        type: "string",
        example: "Medical Association",
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

  EventType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      eventTypeName: {
        type: "string",
        example: "Conference",
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

  ExhibitionType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      exhibitionTypeName: {
        type: "string",
        example: "Trade Exhibition",
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

  ConferenceType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      conferenceTypeName: {
        type: "string",
        example: "Medical Conference",
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

  JobType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      jobTypeName: {
        type: "string",
        example: "Doctor",
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

  ConferenceSegment: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      conferenceSegmentName: {
        type: "string",
        example: "Cardiology",
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
  InterestedAs: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      interestedAsName: {
        type: "string",
        example: "Delegate",
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
  AdvertisementLocation: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      advertisementLocationName: {
        type: "string",
        example: "Homepage Banner",
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
  Company: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        example: "686f8d0d44e8d2f7f7d8c123",
      },

      companyName: {
        type: "string",
        example: "OpenAI Technologies",
      },

      companyEmail: {
        type: "string",
        example: "info@openai.com",
      },

      companyTypeId: {
        $ref: "#/components/schemas/CompanyType",
      },

      stateId: {
        $ref: "#/components/schemas/State",
      },

      city: {
        type: "string",
        example: "Hyderabad",
      },

      address: {
        type: "string",
        example: "Madhapur, Hyderabad",
      },

      website: {
        type: "string",
        example: "https://openai.com",
      },

      featured: {
        type: "boolean",
        example: true,
      },

      mapLink: {
        type: "string",
        example: "https://maps.google.com/...",
        nullable: true,
      },

      phone: {
        type: "string",
        example: "04012345678",
        nullable: true,
      },

      mobile: {
        type: "string",
        example: "9876543210",
        nullable: true,
      },

      uploadLogo: {
        type: "string",
        example: "https://bucket.s3.amazonaws.com/company-logo.png",
        nullable: true,
      },

      status: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
        example: "approved",
      },

      createdBy: {
        $ref: "#/components/schemas/User",
      },

      updatedBy: {
        $ref: "#/components/schemas/User",
        nullable: true,
      },

      approvedBy: {
        $ref: "#/components/schemas/User",
        nullable: true,
      },

      approvedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectedBy: {
        $ref: "#/components/schemas/User",
        nullable: true,
      },

      rejectedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
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

  CreateAssociationTypeRequest: {
    type: "object",

    required: ["associationTypeName"],

    properties: {
      associationTypeName: {
        type: "string",
        example: "Medical Association",
      },
    },
  },

  UpdateAssociationTypeRequest: {
    type: "object",

    required: ["associationTypeName"],

    properties: {
      associationTypeName: {
        type: "string",
        example: "Healthcare Association",
      },
    },
  },

  CreateEventTypeRequest: {
    type: "object",

    required: ["eventTypeName"],

    properties: {
      eventTypeName: {
        type: "string",
        example: "Conference",
      },
    },
  },

  UpdateEventTypeRequest: {
    type: "object",

    required: ["eventTypeName"],

    properties: {
      eventTypeName: {
        type: "string",
        example: "International Conference",
      },
    },
  },

  CreateExhibitionTypeRequest: {
    type: "object",

    required: ["exhibitionTypeName"],

    properties: {
      exhibitionTypeName: {
        type: "string",
        example: "Trade Exhibition",
      },
    },
  },

  UpdateExhibitionTypeRequest: {
    type: "object",

    required: ["exhibitionTypeName"],

    properties: {
      exhibitionTypeName: {
        type: "string",
        example: "International Trade Exhibition",
      },
    },
  },

  CreateConferenceTypeRequest: {
    type: "object",

    required: ["conferenceTypeName"],

    properties: {
      conferenceTypeName: {
        type: "string",
        example: "Medical Conference",
      },
    },
  },
  UpdateConferenceTypeRequest: {
    type: "object",

    required: ["conferenceTypeName"],

    properties: {
      conferenceTypeName: {
        type: "string",
        example: "International Medical Conference",
      },
    },
  },
  CreateJobTypeRequest: {
    type: "object",

    required: ["jobTypeName"],

    properties: {
      jobTypeName: {
        type: "string",
        example: "Doctor",
      },
    },
  },
  UpdateJobTypeRequest: {
    type: "object",

    required: ["jobTypeName"],

    properties: {
      jobTypeName: {
        type: "string",
        example: "Senior Doctor",
      },
    },
  },
  CreateConferenceSegmentRequest: {
    type: "object",

    required: ["conferenceSegmentName"],

    properties: {
      conferenceSegmentName: {
        type: "string",
        example: "Cardiology",
      },
    },
  },
  UpdateConferenceSegmentRequest: {
    type: "object",

    required: ["conferenceSegmentName"],

    properties: {
      conferenceSegmentName: {
        type: "string",
        example: "Interventional Cardiology",
      },
    },
  },
  CreateInterestedAsRequest: {
    type: "object",

    required: ["interestedAsName"],

    properties: {
      interestedAsName: {
        type: "string",
        example: "Delegate",
      },
    },
  },
  UpdateInterestedAsRequest: {
    type: "object",

    required: ["interestedAsName"],

    properties: {
      interestedAsName: {
        type: "string",
        example: "Speaker",
      },
    },
  },
  CreateAdvertisementLocationRequest: {
    type: "object",

    required: ["advertisementLocationName"],

    properties: {
      advertisementLocationName: {
        type: "string",
        example: "Homepage Banner",
      },
    },
  },
  UpdateAdvertisementLocationRequest: {
    type: "object",

    required: ["advertisementLocationName"],

    properties: {
      advertisementLocationName: {
        type: "string",
        example: "Homepage Top Banner",
      },
    },
  },

  GetAllUsersResponse: {
    type: "object",

    properties: {
      success: {
        type: "boolean",
        example: true,
      },

      message: {
        type: "string",
        example: "Users fetched successfully.",
      },

      data: {
        type: "array",

        items: {
          $ref: "#/components/schemas/User",
        },
      },

      pagination: {
        type: "object",

        properties: {
          total: {
            type: "integer",
            example: 50,
          },

          page: {
            type: "integer",
            example: 1,
          },

          limit: {
            type: "integer",
            example: 20,
          },

          totalPages: {
            type: "integer",
            example: 3,
          },

          hasNextPage: {
            type: "boolean",
            example: true,
          },

          hasPreviousPage: {
            type: "boolean",
            example: false,
          },
        },
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
