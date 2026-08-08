import { createEntryTypeExample, updateEntryTypeExample } from "./examples.js";

const entryTypePaths = {
  //==============================
  // Create Entry Type
  //==============================
  "/entry-types": {
    post: {
      tags: ["Entry Type"],

      summary: "Create Entry Type",

      description: "Create a new entry type. Admin only.",

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
              $ref: "#/components/schemas/CreateEntryTypeRequest",
            },

            example: createEntryTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Entry type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Entry type already exists.",
        },
      },
    },

    //==============================
    // Get Entry Types
    //==============================
    get: {
      tags: ["Entry Type"],

      summary: "Get Entry Types",

      description: "Get all entry types with search and sorting.",

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

          description: "Search entry types by entry type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "entryTypeName",
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
          description: "Entry types fetched successfully.",

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

                    example: "Entry types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/EntryType",
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
  "/entry-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Entry Type"],

      summary: "Get Entry Type By ID",

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
          description: "Entry type fetched successfully.",
        },

        404: {
          description: "Entry type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Entry Type"],

      summary: "Update Entry Type",

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
              $ref: "#/components/schemas/UpdateEntryTypeRequest",
            },

            example: updateEntryTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Entry type updated successfully.",
        },

        404: {
          description: "Entry type not found.",
        },

        409: {
          description: "Entry type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Entry Type"],

      summary: "Delete Entry Type",

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
          description: "Entry type deleted successfully.",
        },

        404: {
          description: "Entry type not found.",
        },
      },
    },
  },
};

export default entryTypePaths;
