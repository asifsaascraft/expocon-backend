const venuePaths = {
  //==============================
  // Create Venue
  //==============================
  "/venues": {
    post: {
      tags: ["Venue"],
      summary: "Create Venue",
      description:
        "Create a new venue. Admin-created venues are approved immediately, while staff-created venues remain pending for approval.",

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
                "venueName",
                "stateId",
                "city",
                "address",
                "website",
                "mapLink",
                "uploadVenuePhoto",
              ],

              properties: {
                venueName: {
                  type: "string",
                  example: "Hyderabad International Convention Centre",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
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

                featured: {
                  type: "boolean",
                  example: false,
                },

                phone: {
                  type: "string",
                  example: "04012345678",
                },

                uploadVenuePhoto: {
                  type: "string",
                  format: "binary",
                },

                uploadVenueLayout: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Venue created successfully.",
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
          description: "State not found.",
        },

        409: {
          description: "Venue already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Get Venues
    //==============================
    get: {
      tags: ["Venue"],
      summary: "Get All Venues",
      description:
        "Retrieve a paginated list of venues. Admin can view all venues. Staff can view approved venues along with their own pending and rejected venues.",

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
          description: "Search by venue name, city, website or phone.",
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
          name: "featured",
          schema: {
            type: "boolean",
          },
          description: "Filter by featured venue.",
        },
        {
          in: "query",
          name: "stateId",
          schema: {
            type: "string",
          },
          description: "Filter by State ID.",
        },
      ],

      responses: {
        200: {
          description: "Venues fetched successfully.",

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
                    example: "Venues fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Venue",
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
  // Get Venue by ID
  //==============================
  "/venues/{id}": {
    get: {
      tags: ["Venue"],
      summary: "Get Venue By ID",
      description:
        "Retrieve a single venue by its ID. Admin can access any venue. Staff can access approved venues and their own pending or rejected venues.",

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
          description: "Venue ID.",
        },
      ],

      responses: {
        200: {
          description: "Venue fetched successfully.",

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
                    example: "Venue fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Venue",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid venue ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Venue not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Update Venue
    //==============================
    put: {
      tags: ["Venue"],
      summary: "Update Venue",
      description:
        "Update an existing venue. Admin can update any venue. Staff can update only their own pending venues.",

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
          description: "Venue ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "venueName",
                "stateId",
                "city",
                "address",
                "website",
                "mapLink",
              ],

              properties: {
                venueName: {
                  type: "string",
                  example: "Hyderabad International Convention Centre",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
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

                featured: {
                  type: "boolean",
                  example: true,
                },

                phone: {
                  type: "string",
                  example: "04012345678",
                },

                uploadVenuePhoto: {
                  type: "string",
                  format: "binary",
                },

                uploadVenueLayout: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Venue updated successfully.",

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
                    example: "Venue updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Venue",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid venue ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Venue or State not found.",
        },

        409: {
          description: "Venue name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
    //==============================
    // Delete Venue
    //==============================
    delete: {
      tags: ["Venue"],
      summary: "Delete Venue",
      description:
        "Delete a venue. Admin can delete any venue. Staff can delete only their own pending venue.",

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
          description: "Venue ID.",
        },
      ],

      responses: {
        200: {
          description: "Venue deleted successfully.",

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
                    example: "Venue deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid venue ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending venue.",
        },

        404: {
          description: "Venue not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Approve Venue
  //==============================
  "/venues/{id}/approve": {
    patch: {
      tags: ["Venue"],
      summary: "Approve Venue",
      description:
        "Approve a pending venue. Only administrators are allowed to approve venues.",

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
          description: "Venue ID.",
        },
      ],

      responses: {
        200: {
          description: "Venue approved successfully.",

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
                    example: "Venue approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Venue",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid venue ID or venue is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only administrators can approve venues.",
        },

        404: {
          description: "Venue not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Reject Venue
  //==============================
  "/venues/{id}/reject": {
    patch: {
      tags: ["Venue"],
      summary: "Reject Venue",
      description:
        "Reject a pending venue. Only administrators are allowed to reject venues.",

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
          description: "Venue ID.",
        },
      ],

      responses: {
        200: {
          description: "Venue rejected successfully.",

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
                    example: "Venue rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Venue",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid venue ID or venue is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only administrators can reject venues.",
        },

        404: {
          description: "Venue not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default venuePaths;
