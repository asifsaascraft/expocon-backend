import {
  createAssociationTypeExample,
  updateAssociationTypeExample,
} from "./examples.js";

const associationTypePaths = {
  //==============================
  // Create Association Type
  //==============================
  "/association-types": {
    post: {
      tags: ["Association Type"],

      summary: "Create Association Type",

      description: "Create a new association type. Admin only.",

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
              $ref: "#/components/schemas/CreateAssociationTypeRequest",
            },

            example: createAssociationTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Association type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Association type already exists.",
        },
      },
    },

    //==============================
    // Get Association Types
    //==============================
    get: {
      tags: ["Association Type"],

      summary: "Get Association Types",

      description: "Get all association types with search and sorting.",

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

          description: "Search association types by association type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "associationTypeName",
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
          description: "Association types fetched successfully.",

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
                    example: "Association types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/AssociationType",
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
  "/association-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Association Type"],

      summary: "Get Association Type By ID",

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
          description: "Association type fetched successfully.",
        },

        404: {
          description: "Association type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Association Type"],

      summary: "Update Association Type",

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
              $ref: "#/components/schemas/UpdateAssociationTypeRequest",
            },

            example: updateAssociationTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Association type updated successfully.",
        },

        404: {
          description: "Association type not found.",
        },

        409: {
          description: "Association type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Association Type"],

      summary: "Delete Association Type",

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
          description: "Association type deleted successfully.",
        },

        404: {
          description: "Association type not found.",
        },
      },
    },
  },
};

export default associationTypePaths;
