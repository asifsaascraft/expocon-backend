import {
  createExhibitionTypeExample,
  updateExhibitionTypeExample,
} from "./examples.js";

const exhibitionTypePaths = {
  //==============================
  // Create Exhibition Type
  //==============================
  "/exhibition-types": {
    post: {
      tags: ["Exhibition Type"],

      summary: "Create Exhibition Type",

      description: "Create a new exhibition type. Admin only.",

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
              $ref: "#/components/schemas/CreateExhibitionTypeRequest",
            },

            example: createExhibitionTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Exhibition type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Exhibition type already exists.",
        },
      },
    },

    //==============================
    // Get Exhibition Types
    //==============================
    get: {
      tags: ["Exhibition Type"],

      summary: "Get Exhibition Types",

      description: "Get all exhibition types with search and sorting.",

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

          description: "Search exhibition types by exhibition type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "exhibitionTypeName",
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
          description: "Exhibition types fetched successfully.",

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
                    example: "Exhibition types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/ExhibitionType",
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
  "/exhibition-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Exhibition Type"],

      summary: "Get Exhibition Type By ID",

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
          description: "Exhibition type fetched successfully.",
        },

        404: {
          description: "Exhibition type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Exhibition Type"],

      summary: "Update Exhibition Type",

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
              $ref: "#/components/schemas/UpdateExhibitionTypeRequest",
            },

            example: updateExhibitionTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Exhibition type updated successfully.",
        },

        404: {
          description: "Exhibition type not found.",
        },

        409: {
          description: "Exhibition type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Exhibition Type"],

      summary: "Delete Exhibition Type",

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
          description: "Exhibition type deleted successfully.",
        },

        404: {
          description: "Exhibition type not found.",
        },
      },
    },
  },
};

export default exhibitionTypePaths;
