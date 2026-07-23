import {
  createExhibitionExample,
  updateExhibitionExample,
  rejectExhibitionExample,
  uploadEventLogoExample,
} from "./examples.js";

const exhibitionPaths = {
  //==============================
  // Create Exhibition
  //==============================
  "/exhibitions": {
    post: {
      tags: ["Exhibition"],

      summary: "Create Exhibition",

      description:
        "Create a new exhibition. Admin-created exhibitions are approved immediately, while staff-created exhibitions remain pending for approval.",

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
                "eventTypeId",
                "eventName",
                "eventShortName",
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
                eventTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                  format: "date",
                  example: "2026-08-10",
                },

                endDate: {
                  type: "string",
                  format: "date",
                  example: "2026-08-12",
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
                  example: "https://pharmaexpo.com",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                exhibitionTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },

                uploadEventLogo: {
                  type: "string",
                  format: "binary",
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
                  example: "Manufacturers, Distributors, Exporters",
                },

                speciality: {
                  type: "string",
                  example: "Pharmaceutical Machinery & Equipment",
                },

                visitorProfile: {
                  type: "string",
                  example: "Doctors, Hospitals, Pharma Companies",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Exhibition created successfully.",
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
          description: "Event name or short name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Get Exhibitions
    //==============================
    get: {
      tags: ["Exhibition"],

      summary: "Get All Exhibitions",

      description:
        "Retrieve a paginated list of exhibitions. Admin can view all exhibitions. Staff can view approved exhibitions along with their own pending and rejected exhibitions.",

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
            "Search by event name, short name, city, website, month or year.",
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
          name: "eventTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Event Type ID.",
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
          name: "exhibitionTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Exhibition Type ID.",
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
          description: "Exhibitions fetched successfully.",

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
                    example: "Exhibitions fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Exhibition",
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
  // Get Exhibition By ID
  //==============================
  "/exhibitions/{id}": {
    get: {
      tags: ["Exhibition"],

      summary: "Get Exhibition By ID",

      description:
        "Retrieve a single exhibition by its ID. Admin can access any exhibition. Staff can access approved exhibitions and their own pending or rejected exhibitions.",

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
          description: "Exhibition ID.",
        },
      ],

      responses: {
        200: {
          description: "Exhibition fetched successfully.",

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
                    example: "Exhibition fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Exhibition",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid exhibition ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Exhibition not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Update Exhibition
    //==============================
    put: {
      tags: ["Exhibition"],

      summary: "Update Exhibition",

      description:
        "Update an existing exhibition. Admin can update any exhibition. Staff can update only their own pending exhibitions.",

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
          description: "Exhibition ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "eventTypeId",
                "eventName",
                "eventShortName",
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
                eventTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                  format: "date",
                  example: "2026-08-10",
                },

                endDate: {
                  type: "string",
                  format: "date",
                  example: "2026-08-12",
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
                  example: "https://pharmaexpo.com",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                exhibitionTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },

                uploadEventLogo: {
                  type: "string",
                  format: "binary",
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
                  example: "Manufacturers, Distributors, Exporters",
                },

                speciality: {
                  type: "string",
                  example: "Pharmaceutical Machinery & Equipment",
                },

                visitorProfile: {
                  type: "string",
                  example: "Doctors, Hospitals, Pharma Companies",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Exhibition updated successfully.",

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
                    example: "Exhibition updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Exhibition",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid exhibition ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Exhibition or referenced master data not found.",
        },

        409: {
          description: "Event name or short name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
    //==============================
    // Delete Exhibition
    //==============================
    delete: {
      tags: ["Exhibition"],

      summary: "Delete Exhibition",

      description:
        "Delete an exhibition. Admin can delete any exhibition. Staff can delete only their own pending exhibition.",

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
          description: "Exhibition ID.",
        },
      ],

      responses: {
        200: {
          description: "Exhibition deleted successfully.",

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
                    example: "Exhibition deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid exhibition ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending exhibition.",
        },

        404: {
          description: "Exhibition not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Approve Exhibition
  //==============================
  "/exhibitions/{id}/approve": {
    patch: {
      tags: ["Exhibition"],

      summary: "Approve Exhibition",

      description:
        "Approve a pending exhibition. Only administrators are allowed to approve exhibitions.",

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
          description: "Exhibition ID.",
        },
      ],

      responses: {
        200: {
          description: "Exhibition approved successfully.",

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
                    example: "Exhibition approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Exhibition",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid exhibition ID or exhibition is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can approve exhibitions.",
        },

        404: {
          description: "Exhibition not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Reject Exhibition
  //==============================
  "/exhibitions/{id}/reject": {
    patch: {
      tags: ["Exhibition"],

      summary: "Reject Exhibition",

      description:
        "Reject a pending exhibition. Only administrators are allowed to reject exhibitions.",

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
          description: "Exhibition ID.",
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
                    "Required event information and supporting documents are incomplete.",
                },
              },
            },

            example: rejectExhibitionExample,
          },
        },
      },

      responses: {
        200: {
          description: "Exhibition rejected successfully.",

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
                    example: "Exhibition rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Exhibition",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid exhibition ID or exhibition is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only administrators can reject exhibitions.",
        },

        404: {
          description: "Exhibition not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default exhibitionPaths;
