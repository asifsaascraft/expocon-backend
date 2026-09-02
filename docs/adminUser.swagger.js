import {
  getAllUsersResponseExample,
  getAllStaffsResponseExample,
  getAllPartnersResponseExample,
  createPartnerExample,
} from "./examples.js";

const adminUserPaths = {
  //==============================
  // Get All Users
  //==============================
  "/admin/users": {
    get: {
      tags: ["Admin Users"],

      summary: "Get All Users",

      description:
        "Get all registered users with search, pagination, sorting and status filter. Admin only.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "page",

          schema: {
            type: "integer",
            default: 1,
          },
        },

        {
          in: "query",

          name: "limit",

          schema: {
            type: "integer",
            default: 20,
          },
        },

        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },
        },

        {
          in: "query",

          name: "status",

          schema: {
            type: "string",
            enum: ["pending", "active", "blocked"],
          },
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description: "Users fetched successfully.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllUsersResponse",
              },

              example: getAllUsersResponseExample,
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },
      },
    },
  },

  //==============================
  // Get All Staffs
  //==============================
  "/admin/staffs": {
    get: {
      tags: ["Admin Users"],

      summary: "Get All Staffs",

      description:
        "Get all staff members with search, pagination, sorting and status filter. Admin only.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "page",

          schema: {
            type: "integer",
            default: 1,
          },
        },

        {
          in: "query",

          name: "limit",

          schema: {
            type: "integer",
            default: 20,
          },
        },

        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },
        },

        {
          in: "query",

          name: "status",

          schema: {
            type: "string",
            enum: ["pending", "active", "blocked"],
          },
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description: "Staffs fetched successfully.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllUsersResponse",
              },

              example: getAllStaffsResponseExample,
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },
      },
    },
  },

  "/admin/partners": {
    //==============================
    // Get All Partners
    //==============================
    get: {
      tags: ["Admin Users"],

      summary: "Get All Partners",

      description:
        "Get all partner accounts with search, pagination, sorting and status filter. Admin only.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "page",

          schema: {
            type: "integer",

            default: 1,
          },
        },

        {
          in: "query",

          name: "limit",

          schema: {
            type: "integer",

            default: 20,
          },
        },

        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },
        },

        {
          in: "query",

          name: "status",

          schema: {
            type: "string",

            enum: ["pending", "active", "blocked", "suspended"],
          },
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",

            example: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description: "Partners fetched successfully.",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetAllUsersResponse",
              },

              example: getAllPartnersResponseExample,
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Create Partner
    //==============================
    post: {
      tags: ["Admin Users"],

      summary: "Create Partner",

      description:
        "Create a partner account for an existing company. Only an authenticated admin can create a partner. The company must already exist. The partner account is immediately activated and the email is automatically verified. A temporary password is generated by the backend and sent to the partner's login email.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["companyId", "email"],

              properties: {
                companyId: {
                  type: "string",

                  description:
                    "Existing company ID for which the partner account will be created.",

                  example: "6852b4d04ef5f2e4dbd0d100",
                },

                email: {
                  type: "string",

                  format: "email",

                  description:
                    "Email address that the partner will use to login. The generated password will be sent to this email.",

                  example: "partner@example.com",
                },
              },
            },

            example: createPartnerExample,
          },
        },
      },

      responses: {
        201: {
          description: "Partner created successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Partner created successfully. Login credentials have been sent to the partner's email.",

                data: {
                  id: "6852b4d04ef5f2e4dbd0d201",

                  fullName: "India Trade Promotion Organization",

                  username: "india_trade_promotion_organization",

                  email: "partner@example.com",

                  role: "partner",

                  companyId: "6852b4d04ef5f2e4dbd0d100",

                  companyName: "India Trade Promotion Organization",

                  status: "active",

                  isEmailVerified: true,
                },
              },
            },
          },
        },

        400: {
          description: "Invalid request or company ID.",

          content: {
            "application/json": {
              example: {
                success: false,

                message: "Company ID and email are required.",
              },
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only admins can create partners.",
        },

        404: {
          description: "Company not found.",
        },

        409: {
          description: "Partner or email already exists.",

          content: {
            "application/json": {
              example: {
                success: false,

                message: "A partner already exists for this company.",
              },
            },
          },
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
  //==============================
  // Suspend / Unsuspend User
  //==============================
  "/admin/suspend/{id}": {
    post: {
      tags: ["Admin Users"],

      summary: "Suspend or Unsuspend User (User, Staff, Partner)",

      description:
        "Toggle the account suspension status of a user, partner, or staff member. Only an authenticated admin can access this endpoint. If the account is active, it will be suspended. If the account is suspended, it will be activated again. Admin accounts cannot be suspended.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "path",

          name: "id",

          required: true,

          description: "User ID of the user, partner, or staff member.",

          schema: {
            type: "string",

            example: "6852b4d04ef5f2e4dbd0d010",
          },
        },
      ],

      responses: {
        200: {
          description: "User suspension status updated successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "User suspended successfully.",

                data: {
                  id: "6852b4d04ef5f2e4dbd0d010",

                  fullName: "John Doe",

                  email: "john@example.com",

                  role: "user",

                  status: "suspended",
                },
              },
            },
          },
        },

        400: {
          description: "Invalid account status or unsupported role.",

          content: {
            "application/json": {
              example: {
                success: false,

                message:
                  "User cannot be suspended because account status is pending.",
              },
            },
          },
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Admin accounts cannot be suspended or the requester is not an admin.",
        },

        404: {
          description: "User not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default adminUserPaths;
