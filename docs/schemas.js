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
  EntryType: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "686f9c5c7a4d8b0012345678",
      },

      entryTypeName: {
        type: "string",
        example: "Visitor",
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

      rejectionReason: {
        type: "string",
        example: "Company registration documents are incomplete.",
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

  Venue: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "687c9d2ef7b79a3d12345678",
      },

      venueName: {
        type: "string",
        example: "Hyderabad International Convention Centre",
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
        example: "HITEC City, Hyderabad",
      },

      website: {
        type: "string",
        example: "https://www.hicc.com",
      },

      mapLink: {
        type: "string",
        example: "https://maps.google.com/...",
      },

      uploadVenuePhoto: {
        type: "string",
        example: "https://bucket.s3.amazonaws.com/venue-photos/photo.jpg",
      },

      uploadVenueLayout: {
        type: "string",
        nullable: true,
        example: "https://bucket.s3.amazonaws.com/venue-layouts/layout.pdf",
      },

      featured: {
        type: "boolean",
        example: true,
      },

      phone: {
        type: "string",
        nullable: true,
        example: "04012345678",
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
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      approvedBy: {
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      approvedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectedBy: {
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      rejectedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectionReason: {
        type: "string",
        nullable: true,
        example: "Venue fire safety certificate is missing.",
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
  Exhibition: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "68820d5b63ab9f0a12345678",
      },

      eventTypeId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a11111111",
          },

          eventTypeName: {
            type: "string",
            example: "Exhibition",
          },
        },
      },

      eventName: {
        type: "string",
        example: "India Pharma Expo 2026",
      },

      eventShortName: {
        type: "string",
        example: "IPE2026",
      },

      startDate: {
        type: "string",
        format: "date-time",
        example: "2026-08-10T00:00:00.000Z",
      },

      endDate: {
        type: "string",
        format: "date-time",
        example: "2026-08-12T00:00:00.000Z",
      },

      month: {
        type: "string",
        example: "August",
      },

      year: {
        type: "string",
        example: "2026",
      },

      entryTypeId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a66666666",
          },

          entryTypeName: {
            type: "string",
            example: "Free Entry",
          },
        },
      },

      city: {
        type: "string",
        example: "Hyderabad",
      },

      stateId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a22222222",
          },

          state: {
            type: "string",
            example: "Telangana",
          },
        },
      },

      venueId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a33333333",
          },

          venueName: {
            type: "string",
            example: "HITEX Exhibition Centre",
          },
        },
      },

      website: {
        type: "string",
        example: "https://pharmaexpo.com",
      },

      companyId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a44444444",
          },

          companyName: {
            type: "string",
            example: "ABC Events Pvt Ltd",
          },
        },
      },

      exhibitionTypeId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a55555555",
          },

          exhibitionTypeName: {
            type: "string",
            example: "Trade Show",
          },
        },
      },

      uploadEventLogo: {
        type: "string",
        example: "https://your-bucket.s3.amazonaws.com/event-logos/logo.png",
      },

      frequency: {
        type: "string",
        example: "Annual",
      },

      aboutExhibition: {
        type: "string",
        example: "India's leading pharmaceutical exhibition.",
      },

      exhibitorProfile: {
        type: "string",
        example: "Manufacturers, Importers, Exporters",
      },

      speciality: {
        type: "string",
        example: "Medical Equipment & Pharma Machinery",
      },

      visitorProfile: {
        type: "string",
        example: "Doctors, Hospitals, Pharma Companies",
      },

      status: {
        type: "string",
        example: "approved",
      },

      createdBy: {
        type: "object",

        properties: {
          _id: {
            type: "string",
          },

          fullName: {
            type: "string",
            example: "Admin User",
          },

          email: {
            type: "string",
            example: "admin@example.com",
          },

          role: {
            type: "string",
            example: "admin",
          },
        },
      },

      updatedBy: {
        type: "object",
        nullable: true,
      },

      approvedBy: {
        type: "object",
        nullable: true,
      },

      approvedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectedBy: {
        type: "object",
        nullable: true,
      },

      rejectedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectionReason: {
        type: "string",
        nullable: true,
        example:
          "Required event information and supporting documents are incomplete.",
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
  Conference: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "68820d5b63ab9f0a12345678",
      },

      conferenceTypeId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a11111111",
          },

          conferenceTypeName: {
            type: "string",
            example: "Medical Conference",
          },
        },
      },

      conferenceName: {
        type: "string",
        example: "International Cardiology Conference 2026",
      },

      conferenceShortName: {
        type: "string",
        example: "ICC2026",
      },

      startDate: {
        type: "string",
        format: "date-time",
        example: "2026-11-10T00:00:00.000Z",
      },

      endDate: {
        type: "string",
        format: "date-time",
        example: "2026-11-12T00:00:00.000Z",
      },

      month: {
        type: "string",
        example: "November",
      },

      year: {
        type: "string",
        example: "2026",
      },

      entryTypeId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a66666666",
          },

          entryTypeName: {
            type: "string",
            example: "Paid Entry",
          },
        },
      },

      city: {
        type: "string",
        example: "Hyderabad",
      },

      stateId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a22222222",
          },

          state: {
            type: "string",
            example: "Telangana",
          },
        },
      },

      venueId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a33333333",
          },

          venueName: {
            type: "string",
            example: "HICC Convention Centre",
          },
        },
      },

      website: {
        type: "string",
        example: "https://icc2026.com",
      },

      companyId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a44444444",
          },

          companyName: {
            type: "string",
            example: "ABC Events Pvt Ltd",
          },
        },
      },

      conferenceSegmentId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a55555555",
          },

          conferenceSegmentName: {
            type: "string",
            example: "Healthcare",
          },
        },
      },

      associationId: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "68820d5b63ab9f0a77777777",
          },

          associationName: {
            type: "string",
            example: "Indian Medical Association",
          },
        },
      },

      uploadConferenceLogo: {
        type: "string",
        example:
          "https://your-bucket.s3.amazonaws.com/conference-logos/logo.png",
      },

      committeeMember: {
        type: "string",
        example: "Scientific Committee",
      },

      frequency: {
        type: "string",
        example: "Annual",
      },

      aboutConference: {
        type: "string",
        example:
          "International conference focused on advancements in cardiology and healthcare.",
      },

      status: {
        type: "string",
        example: "approved",
      },

      createdBy: {
        type: "object",

        properties: {
          _id: {
            type: "string",
          },

          fullName: {
            type: "string",
            example: "Admin User",
          },

          email: {
            type: "string",
            example: "admin@example.com",
          },

          role: {
            type: "string",
            example: "admin",
          },
        },
      },

      updatedBy: {
        type: "object",
        nullable: true,
      },

      approvedBy: {
        type: "object",
        nullable: true,
      },

      approvedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectedBy: {
        type: "object",
        nullable: true,
      },

      rejectedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectionReason: {
        type: "string",
        nullable: true,
        example:
          "Required conference information and supporting documents are incomplete.",
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
  Association: {
    type: "object",

    properties: {
      _id: {
        type: "string",
        example: "68820d5b63ab9f0a12345678",
      },

      associationName: {
        type: "string",
        example: "Indian Medical Association",
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
        example: "HITEC City, Hyderabad",
      },

      website: {
        type: "string",
        example: "https://imaindia.org",
      },

      associationTypeId: {
        $ref: "#/components/schemas/AssociationType",
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
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      approvedBy: {
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      approvedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectedBy: {
        allOf: [
          {
            $ref: "#/components/schemas/User",
          },
        ],
        nullable: true,
      },

      rejectedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      rejectionReason: {
        type: "string",
        nullable: true,
        example: "Association registration documents are incomplete.",
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

  CreateEntryTypeRequest: {
    type: "object",

    required: ["entryTypeName"],

    properties: {
      entryTypeName: {
        type: "string",
        example: "Visitor",
      },
    },
  },

  UpdateEntryTypeRequest: {
    type: "object",

    required: ["entryTypeName"],

    properties: {
      entryTypeName: {
        type: "string",
        example: "VIP Visitor",
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
