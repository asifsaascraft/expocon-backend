import {
  createContactExample,
  updateContactExample,
  rejectContactExample,
} from "./examples.js";

const contactPaths = {
  //==============================
  // Create Contact
  //==============================
  "/contacts": {
    post: {
      tags: ["Contact"],

      summary: "Create Contact",

      description:
        "Create a new contact. Admin-created contacts are approved immediately, while staff-created contacts remain pending for approval.",

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

              required: ["fullName"],

              properties: {
                fullName: {
                  type: "string",
                  example: "Asif Jamal",
                },

                email: {
                  type: "string",
                  example: "asif@example.com",
                },

                mobile: {
                  type: "string",
                  example: "9876543210",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                venueId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                associationId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },
              },
            },

            example: createContactExample,
          },
        },
      },

      responses: {
        201: {
          description: "Contact created successfully.",
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
            "State, Company, Venue or Association not found.",
        },

        409: {
          description: "Email or mobile already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
        //==============================
    // Get Contacts
    //==============================
    get: {
      tags: ["Contact"],

      summary: "Get All Contacts",

      description:
        "Retrieve a paginated list of contacts. Admin can view all contacts. Staff can view approved contacts along with their own pending and rejected contacts.",

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

          description: "Search by full name, email or mobile.",
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

          name: "companyId",

          schema: {
            type: "string",
          },

          description: "Filter by Company ID.",
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

          name: "associationId",

          schema: {
            type: "string",
          },

          description: "Filter by Association ID.",
        },
      ],

      responses: {
        200: {
          description: "Contacts fetched successfully.",

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
                    example: "Contacts fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Contact",
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
  // Get Contact By ID
  //==============================
  "/contacts/{id}": {
    get: {
      tags: ["Contact"],

      summary: "Get Contact By ID",

      description:
        "Retrieve a single contact by its ID. Admin can access any contact. Staff can access approved contacts and their own pending or rejected contacts.",

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

          description: "Contact ID.",
        },
      ],

      responses: {
        200: {
          description: "Contact fetched successfully.",

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
                    example: "Contact fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Contact",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid contact ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Contact not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
        //==============================
    // Update Contact
    //==============================
    put: {
      tags: ["Contact"],

      summary: "Update Contact",

      description:
        "Update an existing contact. Admin can update any contact. Staff can update only their own pending contacts.",

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

          description: "Contact ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: ["fullName"],

              properties: {
                fullName: {
                  type: "string",
                  example: "Asif Jamal",
                },

                email: {
                  type: "string",
                  example: "asif@example.com",
                },

                mobile: {
                  type: "string",
                  example: "9876543210",
                },

                stateId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d87654321",
                },

                companyId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d11111111",
                },

                venueId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d22222222",
                },

                associationId: {
                  type: "string",
                  example: "687c9d2ef7b79a3d33333333",
                },
              },
            },

            example: updateContactExample,
          },
        },
      },

      responses: {
        200: {
          description: "Contact updated successfully.",

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
                    example: "Contact updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Contact",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid contact ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description:
            "Contact, State, Company, Venue or Association not found.",
        },

        409: {
          description: "Email or mobile already exists.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
        //==============================
    // Delete Contact
    //==============================
    delete: {
      tags: ["Contact"],

      summary: "Delete Contact",

      description:
        "Delete a contact. Admin can delete any contact. Staff can delete only their own pending contact.",

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

          description: "Contact ID.",
        },
      ],

      responses: {
        200: {
          description: "Contact deleted successfully.",

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
                    example: "Contact deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid contact ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending contact.",
        },

        404: {
          description: "Contact not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
  //==============================
  // Approve Contact
  //==============================
  "/contacts/{id}/approve": {
    patch: {
      tags: ["Contact"],

      summary: "Approve Contact",

      description:
        "Approve a pending contact. Only administrators are allowed to approve contacts.",

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

          description: "Contact ID.",
        },
      ],

      responses: {
        200: {
          description: "Contact approved successfully.",

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
                    example: "Contact approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Contact",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid contact ID or contact is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can approve contacts.",
        },

        404: {
          description: "Contact not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
    //==============================
  // Reject Contact
  //==============================
  "/contacts/{id}/reject": {
    patch: {
      tags: ["Contact"],

      summary: "Reject Contact",

      description:
        "Reject a pending contact. Only administrators are allowed to reject contacts.",

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

          description: "Contact ID.",
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
                  example: "Contact information is incomplete.",
                },
              },
            },

            example: rejectContactExample,
          },
        },
      },

      responses: {
        200: {
          description: "Contact rejected successfully.",

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
                    example: "Contact rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Contact",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid contact ID or contact is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can reject contacts.",
        },

        404: {
          description: "Contact not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default contactPaths;