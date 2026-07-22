const associationPaths = {
  //==============================
  // Create Association
  //==============================
  "/associations": {
    post: {
      tags: ["Association"],

      summary: "Create Association",

      description:
        "Create a new association. Admin-created associations are approved immediately, while staff-created associations remain pending for approval.",

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

              required: [
                "associationName",
                "stateId",
                "city",
                "address",
                "website",
                "associationTypeId",
              ],

              properties: {
                associationName: {
                  type: "string",
                  example: "Indian Medical Association",
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
                  example:
                    "HITEC City, Hyderabad, Telangana",
                },

                website: {
                  type: "string",
                  example: "https://imaindia.org",
                },

                associationTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d99999999",
                },
              },
            },
          },
        },
      },

      responses: {
                201: {
          description: "Association created successfully.",
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
          description:
            "State or Association Type not found.",
        },

        409: {
          description: "Association already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Get Associations
    //==============================
    get: {
      tags: ["Association"],

      summary: "Get All Associations",

      description:
        "Retrieve a paginated list of associations. Admin can view all associations. Staff can view approved associations along with their own pending and rejected associations.",

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
            "Search by association name, city or website.",
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
          name: "stateId",
          schema: {
            type: "string",
          },
          description: "Filter by State ID.",
        },
        {
          in: "query",
          name: "associationTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Association Type ID.",
        },
      ],

      responses: {
                200: {
          description: "Associations fetched successfully.",

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
                    example: "Associations fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Association",
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
  // Get Association By ID
  //==============================
  "/associations/{id}": {
    get: {
      tags: ["Association"],

      summary: "Get Association By ID",

      description:
        "Retrieve a single association by its ID. Admin can access any association. Staff can access approved associations and their own pending or rejected associations.",

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

          description: "Association ID.",
        },
      ],

      responses: {
        200: {
          description: "Association fetched successfully.",

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
                    example: "Association fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Association",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid association ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Association not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Update Association
    //==============================
    put: {
      tags: ["Association"],

      summary: "Update Association",

      description:
        "Update an existing association. Admin can update any association. Staff can update only their own pending associations.",

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

          description: "Association ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: [
                "associationName",
                "stateId",
                "city",
                "address",
                "website",
                "associationTypeId",
              ],

              properties: {
                associationName: {
                  type: "string",
                  example: "Indian Medical Association",
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
                  example: "https://imaindia.org",
                },

                associationTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d99999999",
                },
              },
            },
          },
        },
      },

      responses: {
                200: {
          description: "Association updated successfully.",

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
                    example: "Association updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Association",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid association ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Association, State or Association Type not found.",
        },

        409: {
          description: "Association name already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Delete Association
    //==============================
    delete: {
      tags: ["Association"],

      summary: "Delete Association",

      description:
        "Delete an association. Admin can delete any association. Staff can delete only their own pending association.",

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

          description: "Association ID.",
        },
      ],

      responses: {
                200: {
          description: "Association deleted successfully.",

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
                    example: "Association deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid association ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending association.",
        },

        404: {
          description: "Association not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Approve Association
  //==============================
  "/associations/{id}/approve": {
    patch: {
      tags: ["Association"],

      summary: "Approve Association",

      description:
        "Approve a pending association. Only administrators are allowed to approve associations.",

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

          description: "Association ID.",
        },
      ],

      responses: {
                200: {
          description: "Association approved successfully.",

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
                    example: "Association approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Association",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid association ID or association is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can approve associations.",
        },

        404: {
          description: "Association not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Reject Association
  //==============================
  "/associations/{id}/reject": {
    patch: {
      tags: ["Association"],

      summary: "Reject Association",

      description:
        "Reject a pending association. Only administrators are allowed to reject associations.",

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

          description: "Association ID.",
        },
      ],

      responses: {
                200: {
          description: "Association rejected successfully.",

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
                    example: "Association rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Association",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid association ID or association is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can reject associations.",
        },

        404: {
          description: "Association not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default associationPaths;
                