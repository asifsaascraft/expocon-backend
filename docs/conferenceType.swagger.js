import {
  createConferenceTypeExample,
  updateConferenceTypeExample,
} from "./examples.js";

const conferenceTypePaths = {
  //==============================
  // Create Conference Type
  //==============================
  "/conference-types": {
    post: {
      tags: ["Conference Type"],

      summary: "Create Conference Type",

      description: "Create a new conference type. Admin only.",

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
              $ref: "#/components/schemas/CreateConferenceTypeRequest",
            },

            example: createConferenceTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Conference type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Conference type already exists.",
        },
      },
    },

    //==============================
    // Get Conference Types
    //==============================
    get: {
      tags: ["Conference Type"],

      summary: "Get Conference Types",

      description: "Get all conference types with search and sorting.",

      security: [
        {
          bearerAuth: [],
        },
      ],

      parameters: [
        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },

          description: "Search conference types by conference type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "conferenceTypeName",
          },

          description: "Field to sort by.",
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            example: "asc",
          },

          description: "Sorting order.",
        },
      ],

      responses: {
        200: {
          description: "Conference types fetched successfully.",

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

                    example: "Conference types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/ConferenceType",
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
  // Get / Update / Delete By ID
  //==============================
  "/conference-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Conference Type"],

      summary: "Get Conference Type By ID",

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
        },
      ],

      responses: {
        200: {
          description: "Conference type fetched successfully.",
        },

        404: {
          description: "Conference type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Conference Type"],

      summary: "Update Conference Type",

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
        },
      ],

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateConferenceTypeRequest",
            },

            example: updateConferenceTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Conference type updated successfully.",
        },

        404: {
          description: "Conference type not found.",
        },

        409: {
          description: "Conference type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Conference Type"],

      summary: "Delete Conference Type",

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
        },
      ],

      responses: {
        200: {
          description: "Conference type deleted successfully.",
        },

        404: {
          description: "Conference type not found.",
        },
      },
    },
  },
};

export default conferenceTypePaths;
