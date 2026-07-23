import {
  createConferenceExample,
  updateConferenceExample,
  rejectConferenceExample,
  uploadConferenceLogoExample,
} from "./examples.js";

const conferencePaths = {
  //==============================
  // Create Conference
  //==============================
  "/conferences": {
    post: {
      tags: ["Conference"],

      summary: "Create Conference",

      description:
        "Create a new conference. Admin-created conferences are approved immediately, while staff-created conferences remain pending for approval.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "conferenceTypeId",
                "conferenceName",
                "conferenceShortName",
                "startDate",
                "endDate",
                "month",
                "year",
                "entryTypeId",
                "city",
                "stateId",
                "venueId",
                "website",
              ],

              properties: {
                conferenceTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                  format: "date",
                  example: "2026-11-10",
                },

                endDate: {
                  type: "string",
                  format: "date",
                  example: "2026-11-12",
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
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                city: {
                  type: "string",
                  example: "Hyderabad",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
                },

                venueId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                website: {
                  type: "string",
                  example: "https://icc2026.com",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                conferenceSegmentId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },

                associationId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d44444444",
                },

                uploadConferenceLogo: {
                  type: "string",
                  format: "binary",
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
                    "International conference focused on advancements in cardiology.",
                },
              },
            },

            example: createConferenceExample,
          },
        },
      },

      responses: {
        201: {
          description: "Conference created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Referenced master data not found.",
        },

        409: {
          description: "Conference name or short name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Get Conferences
    //==============================
    get: {
      tags: ["Conference"],

      summary: "Get All Conferences",

      description:
        "Retrieve a paginated list of conferences. Admin can view all conferences. Staff can view approved conferences along with their own pending and rejected conferences.",

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
          description: "Page number.",
        },

        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Number of records per page.",
        },

        {
          in: "query",
          name: "search",
          schema: {
            type: "string",
          },
          description:
            "Search by conference name, short name, city, website, month or year.",
        },

        {
          in: "query",
          name: "sortBy",
          schema: {
            type: "string",
            example: "createdAt",
          },
          description: "Field to sort by.",
        },

        {
          in: "query",
          name: "sortOrder",
          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "desc",
          },
          description: "Sorting order.",
        },

        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["pending", "approved", "rejected"],
          },
          description: "Filter by status (Admin only).",
        },

        {
          in: "query",
          name: "conferenceTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Conference Type ID.",
        },

        {
          in: "query",
          name: "stateId",
          schema: {
            type: "string",
          },
          description: "Filter by State ID.",
        },

        {
          in: "query",
          name: "venueId",
          schema: {
            type: "string",
          },
          description: "Filter by Venue ID.",
        },

        {
          in: "query",
          name: "companyId",
          schema: {
            type: "string",
          },
          description: "Filter by Company ID.",
        },

        {
          in: "query",
          name: "conferenceSegmentId",
          schema: {
            type: "string",
          },
          description: "Filter by Conference Segment ID.",
        },

        {
          in: "query",
          name: "associationId",
          schema: {
            type: "string",
          },
          description: "Filter by Association ID.",
        },

        {
          in: "query",
          name: "entryTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Entry Type ID.",
        },
      ],

      responses: {
        200: {
          description: "Conferences fetched successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conferences fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Conference",
                    },
                  },

                  meta: {
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
                        example: 10,
                      },

                      totalPages: {
                        type: "integer",
                        example: 5,
                      },

                      hasNextPage: {
                        type: "boolean",
                        example: true,
                      },

                      hasPrevPage: {
                        type: "boolean",
                        example: false,
                      },
                    },
                  },
                },
              },
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
  },
    //==============================
  // Get Conference By ID
  //==============================
  "/conferences/{id}": {
    get: {
      tags: ["Conference"],

      summary: "Get Conference By ID",

      description:
        "Retrieve a single conference by its ID. Admin can access any conference. Staff can access approved conferences and their own pending or rejected conferences.",

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
          schema: {
            type: "string",
          },
          description: "Conference ID.",
        },
      ],

      responses: {
        200: {
          description: "Conference fetched successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conference fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Conference",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid conference ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Conference not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Update Conference
    //==============================
    put: {
      tags: ["Conference"],

      summary: "Update Conference",

      description:
        "Update an existing conference. Admin can update any conference. Staff can update only their own pending conferences.",

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
          schema: {
            type: "string",
          },
          description: "Conference ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "conferenceTypeId",
                "conferenceName",
                "conferenceShortName",
                "startDate",
                "endDate",
                "month",
                "year",
                "entryTypeId",
                "city",
                "stateId",
                "venueId",
                "website",
              ],

              properties: {
                conferenceTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                  format: "date",
                  example: "2026-11-10",
                },

                endDate: {
                  type: "string",
                  format: "date",
                  example: "2026-11-12",
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
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                city: {
                  type: "string",
                  example: "Hyderabad",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
                },

                venueId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                website: {
                  type: "string",
                  example: "https://icc2026.com",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                conferenceSegmentId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },

                associationId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d44444444",
                },

                uploadConferenceLogo: {
                  type: "string",
                  format: "binary",
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
                    "International conference focused on advancements in cardiology.",
                },
              },
            },

            example: updateConferenceExample,
          },
        },
      },

      responses: {
        200: {
          description: "Conference updated successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conference updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Conference",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid conference ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Conference or referenced master data not found.",
        },

        409: {
          description: "Conference name or short name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
        //==============================
    // Delete Conference
    //==============================
    delete: {
      tags: ["Conference"],

      summary: "Delete Conference",

      description:
        "Delete a conference. Admin can delete any conference. Staff can delete only their own pending conference.",

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
          schema: {
            type: "string",
          },
          description: "Conference ID.",
        },
      ],

      responses: {
        200: {
          description: "Conference deleted successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conference deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid conference ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending conference.",
        },

        404: {
          description: "Conference not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Approve Conference
  //==============================
  "/conferences/{id}/approve": {
    patch: {
      tags: ["Conference"],

      summary: "Approve Conference",

      description:
        "Approve a pending conference. Only administrators are allowed to approve conferences.",

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
          schema: {
            type: "string",
          },
          description: "Conference ID.",
        },
      ],

      responses: {
        200: {
          description: "Conference approved successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conference approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Conference",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid conference ID or conference is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can approve conferences.",
        },

        404: {
          description: "Conference not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Reject Conference
  //==============================
  "/conferences/{id}/reject": {
    patch: {
      tags: ["Conference"],

      summary: "Reject Conference",

      description:
        "Reject a pending conference. Only administrators are allowed to reject conferences.",

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
          schema: {
            type: "string",
          },
          description: "Conference ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["rejectionReason"],

              properties: {
                rejectionReason: {
                  type: "string",
                  example:
                    "Required conference information and supporting documents are incomplete.",
                },
              },
            },

            example: rejectConferenceExample,
          },
        },
      },

      responses: {
        200: {
          description: "Conference rejected successfully.",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },

                  message: {
                    type: "string",
                    example: "Conference rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Conference",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid conference ID or conference is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can reject conferences.",
        },

        404: {
          description: "Conference not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default conferencePaths;