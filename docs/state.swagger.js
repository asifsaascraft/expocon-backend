import { createStateExample, updateStateExample } from "./examples.js";

const statePaths = {
  //==============================
  // Create State
  //==============================
  "/states": {
    post: {
      tags: ["State"],

      summary: "Create State",

      description: "Create a new state. Admin only.",

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
              $ref: "#/components/schemas/CreateStateRequest",
            },

            example: createStateExample,
          },
        },
      },

      responses: {
        201: {
          description: "State created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "State already exists.",
        },
      },
    },

    //==============================
    // Get States
    //==============================
    get: {
      tags: ["State"],

      summary: "Get States",

      description: "Get all states with search and sorting.",

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

          description: "Search states by state name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "state",
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
          description: "States fetched successfully.",

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
                    example: "States fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/State",
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
  "/states/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["State"],

      summary: "Get State By ID",

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
          description: "State fetched successfully.",
        },

        404: {
          description: "State not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["State"],

      summary: "Update State",

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
              $ref: "#/components/schemas/UpdateStateRequest",
            },

            example: updateStateExample,
          },
        },
      },

      responses: {
        200: {
          description: "State updated successfully.",
        },

        404: {
          description: "State not found.",
        },

        409: {
          description: "State already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["State"],

      summary: "Delete State",

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
          description: "State deleted successfully.",
        },

        404: {
          description: "State not found.",
        },
      },
    },
  },
};

export default statePaths;
