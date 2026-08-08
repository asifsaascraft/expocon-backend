import {
  createInterestedAsExample,
  updateInterestedAsExample,
} from "./examples.js";

const interestedAsPaths = {
  //==============================
  // Create Interested As
  //==============================
  "/interested-as": {
    post: {
      tags: ["Interested As"],

      summary: "Create Interested As",

      description: "Create a new Interested As. Admin only.",

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
              $ref: "#/components/schemas/CreateInterestedAsRequest",
            },

            example: createInterestedAsExample,
          },
        },
      },

      responses: {
        201: {
          description: "Interested As created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Interested As already exists.",
        },
      },
    },

    //==============================
    // Get Interested As
    //==============================
    get: {
      tags: ["Interested As"],

      summary: "Get Interested As",

      description: "Get all Interested As with search and sorting.",

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

          description: "Search Interested As by name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "interestedAsName",
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
          description: "Interested As fetched successfully.",

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
                    example: "Interested As fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/InterestedAs",
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
  "/interested-as/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Interested As"],

      summary: "Get Interested As By ID",

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
          description: "Interested As fetched successfully.",
        },

        404: {
          description: "Interested As not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Interested As"],

      summary: "Update Interested As",

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
              $ref: "#/components/schemas/UpdateInterestedAsRequest",
            },

            example: updateInterestedAsExample,
          },
        },
      },

      responses: {
        200: {
          description: "Interested As updated successfully.",
        },

        404: {
          description: "Interested As not found.",
        },

        409: {
          description: "Interested As already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Interested As"],

      summary: "Delete Interested As",

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
          description: "Interested As deleted successfully.",
        },

        404: {
          description: "Interested As not found.",
        },
      },
    },
  },
};

export default interestedAsPaths;
