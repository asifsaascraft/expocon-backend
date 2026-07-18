const companyPaths = {
  //==============================
  // Create Company
  //==============================
  "/companies": {
    post: {
      tags: ["Company"],
      summary: "Create Company",
      description:
        "Create a new company. Admin-created companies are approved immediately, while staff-created companies remain pending for approval.",

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
                "companyName",
                "companyEmail",
                "companyTypeId",
                "stateId",
                "city",
                "address",
                "website",
              ],

              properties: {
                companyName: {
                  type: "string",
                  example: "OpenAI Technologies",
                },

                companyEmail: {
                  type: "string",
                  example: "info@openai.com",
                },

                companyTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                  example: "Madhapur, Hyderabad",
                },

                website: {
                  type: "string",
                  example: "https://openai.com",
                },

                featured: {
                  type: "boolean",
                  example: false,
                },

                mapLink: {
                  type: "string",
                  example: "https://maps.google.com/...",
                },

                phone: {
                  type: "string",
                  example: "04012345678",
                },

                mobile: {
                  type: "string",
                  example: "9876543210",
                },

                uploadLogo: {
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
          description: "Company created successfully.",
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
          description: "Company type or state not found.",
        },

        409: {
          description: "Company already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
    //==============================
    // Get Companies
    //==============================
    get: {
      tags: ["Company"],
      summary: "Get All Companies",
      description:
        "Retrieve a paginated list of companies. Admin can view all companies. Staff can view approved companies along with their own pending and rejected companies.",

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
            "Search by company name, company email, city, mobile or phone.",
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
          description: "Filter by featured company.",
        },
        {
          in: "query",
          name: "companyTypeId",
          schema: {
            type: "string",
          },
          description: "Filter by Company Type ID.",
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
          description: "Companies fetched successfully.",

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
                    example: "Companies fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Company",
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
  // Get Company by ID
  //============================
  "/companies/{id}": {
    get: {
      tags: ["Company"],
      summary: "Get Company By ID",
      description:
        "Retrieve a single company by its ID. Admin can access any company. Staff can access approved companies and their own pending or rejected companies.",

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
          description: "Company ID.",
        },
      ],

      responses: {
        200: {
          description: "Company fetched successfully.",

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
                    example: "Company fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Company",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid company ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Company not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
    //==============================
    // Update Company
    //============================
    put: {
      tags: ["Company"],
      summary: "Update Company",
      description:
        "Update an existing company. Admin can update any company. Staff can update only their own pending companies.",

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
          description: "Company ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: [
                "companyName",
                "companyEmail",
                "companyTypeId",
                "stateId",
                "city",
                "address",
                "website",
              ],

              properties: {
                companyName: {
                  type: "string",
                  example: "OpenAI Technologies",
                },

                companyEmail: {
                  type: "string",
                  example: "info@openai.com",
                },

                companyTypeId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d12345678",
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
                },

                phone: {
                  type: "string",
                  example: "04012345678",
                },

                mobile: {
                  type: "string",
                  example: "9876543210",
                },

                uploadLogo: {
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
          description: "Company updated successfully.",

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
                    example: "Company updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Company",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid company ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Company, Company Type or State not found.",
        },

        409: {
          description: "Company name, email or mobile already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
    //==============================
    // DELETE Company   //============================
    delete: {
      tags: ["Company"],
      summary: "Delete Company",
      description:
        "Delete a company. Admin can delete any company. Staff can delete only their own pending company.",

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
          description: "Company ID.",
        },
      ],

      responses: {
        200: {
          description: "Company deleted successfully.",

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
                    example: "Company deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid company ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending company.",
        },

        404: {
          description: "Company not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
  //==============================
  // Approve Company
  //============================
  "/companies/{id}/approve": {
    patch: {
      tags: ["Company"],
      summary: "Approve Company",
      description:
        "Approve a pending company. Only administrators are allowed to approve companies.",

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
          description: "Company ID.",
        },
      ],

      responses: {
        200: {
          description: "Company approved successfully.",

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
                    example: "Company approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Company",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid company ID or company is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only administrators can approve companies.",
        },

        404: {
          description: "Company not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
  //==============================
  // Reject Company
  //============================
  "/companies/{id}/reject": {
    patch: {
      tags: ["Company"],
      summary: "Reject Company",
      description:
        "Reject a pending company. Only administrators are allowed to reject companies.",

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
          description: "Company ID.",
        },
      ],

      responses: {
        200: {
          description: "Company rejected successfully.",

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
                    example: "Company rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Company",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid company ID or company is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden. Only administrators can reject companies.",
        },

        404: {
          description: "Company not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default companyPaths;
