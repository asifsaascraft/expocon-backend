import {
  createAdvertisementExample,
  updateAdvertisementExample,
  rejectAdvertisementExample,
  uploadAdvertisementLogoExample,
} from "./examples.js";

const advertisementPaths = {
  //==============================
  // Create Advertisement
  //==============================
  "/advertisements": {
    post: {
      tags: ["Advertisement"],

      summary: "Create Advertisement",

      description:
        "Create a new advertisement. Admin-created advertisements are approved immediately, while staff-created advertisements remain pending for approval.",

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

              required: ["advertisementLocationId", "uploadAdvertisementLogo"],

              properties: {
                advertisementLocationId: {
                  type: "string",
                  example: "68820d5b63ab9f0a11111111",
                },

                uploadAdvertisementLogo: {
                  type: "string",
                  format: "binary",
                },
              },
            },

            encoding: {
              uploadAdvertisementLogo: {
                contentType: "image/*",
              },
            },

            examples: {
              advertisement: {
                value: createAdvertisementExample,
              },

              uploadAdvertisementLogo: {
                value: uploadAdvertisementLogoExample,
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Advertisement created successfully.",
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
          description: "Advertisement location not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
        //==============================
    // Get Advertisements
    //==============================
    get: {
      tags: ["Advertisement"],

      summary: "Get All Advertisements",

      description:
        "Retrieve a paginated list of advertisements. Admin can view all advertisements. Staff can view approved advertisements along with their own pending and rejected advertisements.",

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
          name: "advertisementLocationId",
          schema: {
            type: "string",
          },
          description: "Filter by Advertisement Location ID.",
        },
      ],

      responses: {
        200: {
          description: "Advertisements fetched successfully.",

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
                    example: "Advertisements fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Advertisement",
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
  // Get Advertisement By ID
  //==============================
  "/advertisements/{id}": {
    get: {
      tags: ["Advertisement"],

      summary: "Get Advertisement By ID",

      description:
        "Retrieve a single advertisement by its ID. Admin can access any advertisement. Staff can access approved advertisements and their own pending or rejected advertisements.",

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
          description: "Advertisement ID.",
        },
      ],

      responses: {
        200: {
          description: "Advertisement fetched successfully.",

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
                    example: "Advertisement fetched successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Advertisement",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid advertisement ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description: "Advertisement not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Update Advertisement
    //==============================
    put: {
      tags: ["Advertisement"],

      summary: "Update Advertisement",

      description:
        "Update an existing advertisement. Admin can update any advertisement. Staff can update only their own pending advertisements.",

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
          description: "Advertisement ID.",
        },
      ],

      requestBody: {
        required: true,

        content: {
          "multipart/form-data": {
            schema: {
              type: "object",

              required: ["advertisementLocationId"],

              properties: {
                advertisementLocationId: {
                  type: "string",
                  example: "68820d5b63ab9f0a11111111",
                },

                uploadAdvertisementLogo: {
                  type: "string",
                  format: "binary",
                },
              },
            },

            encoding: {
              uploadAdvertisementLogo: {
                contentType: "image/*",
              },
            },

            examples: {
              advertisement: {
                value: updateAdvertisementExample,
              },

              uploadAdvertisementLogo: {
                value: uploadAdvertisementLogoExample,
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Advertisement updated successfully.",

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
                    example: "Advertisement updated successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Advertisement",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Validation error or invalid advertisement ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description: "Forbidden.",
        },

        404: {
          description:
            "Advertisement or advertisement location not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },

    //==============================
    // Delete Advertisement
    //==============================
    delete: {
      tags: ["Advertisement"],

      summary: "Delete Advertisement",

      description:
        "Delete an advertisement. Admin can delete any advertisement. Staff can delete only their own pending advertisement.",

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
          description: "Advertisement ID.",
        },
      ],

      responses: {
        200: {
          description: "Advertisement deleted successfully.",

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
                    example: "Advertisement deleted successfully.",
                  },
                },
              },
            },
          },
        },

        400: {
          description: "Invalid advertisement ID.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Staff can delete only their own pending advertisement.",
        },

        404: {
          description: "Advertisement not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
    //==============================
  // Approve Advertisement
  //==============================
  "/advertisements/{id}/approve": {
    patch: {
      tags: ["Advertisement"],

      summary: "Approve Advertisement",

      description:
        "Approve a pending advertisement. Only administrators are allowed to approve advertisements.",

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
          description: "Advertisement ID.",
        },
      ],

      responses: {
        200: {
          description: "Advertisement approved successfully.",

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
                    example: "Advertisement approved successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Advertisement",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid advertisement ID or advertisement is already approved.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can approve advertisements.",
        },

        404: {
          description: "Advertisement not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  //==============================
  // Reject Advertisement
  //==============================
  "/advertisements/{id}/reject": {
    patch: {
      tags: ["Advertisement"],

      summary: "Reject Advertisement",

      description:
        "Reject a pending advertisement. Only administrators are allowed to reject advertisements.",

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
          description: "Advertisement ID.",
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
                    "Advertisement image does not meet the required guidelines.",
                },
              },
            },

            example: rejectAdvertisementExample,
          },
        },
      },

      responses: {
        200: {
          description: "Advertisement rejected successfully.",

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
                    example: "Advertisement rejected successfully.",
                  },

                  data: {
                    $ref: "#/components/schemas/Advertisement",
                  },
                },
              },
            },
          },
        },

        400: {
          description:
            "Invalid advertisement ID or advertisement is already rejected.",
        },

        401: {
          description: "Unauthorized.",
        },

        403: {
          description:
            "Forbidden. Only administrators can reject advertisements.",
        },

        404: {
          description: "Advertisement not found.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default advertisementPaths;