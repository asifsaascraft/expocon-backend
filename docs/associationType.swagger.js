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

      description:
        "Create a new association type. Admin only.",

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
              $ref:
                "#/components/schemas/CreateAssociationTypeRequest",
            },

            example: createAssociationTypeExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Association type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Association type already exists.",
        },
      },
    },

    //==============================
    // Get Association Types
    //==============================
    get: {
      tags: ["Association Type"],

      summary: "Get Association Types",

      description:
        "Get paginated association types with search, sorting and pagination.",

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
        },

        {
          in: "query",

          name: "limit",

          schema: {
            type: "integer",
            default: 20,
          },
        },

        {
          in: "query",

          name: "search",

          schema: {
            type: "string",
          },
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "createdAt",
          },
        },

        {
          in: "query",

          name: "order",

          schema: {
            type: "string",
            enum: ["asc", "desc"],
            example: "desc",
          },
        },
      ],

      responses: {
        200: {
          description:
            "Association types fetched successfully.",
        },

        401: {
          description: "Unauthorized.",
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
          description:
            "Association type fetched successfully.",
        },

        404: {
          description:
            "Association type not found.",
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
              $ref:
                "#/components/schemas/UpdateAssociationTypeRequest",
            },

            example: updateAssociationTypeExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Association type updated successfully.",
        },

        404: {
          description:
            "Association type not found.",
        },

        409: {
          description:
            "Association type already exists.",
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
          description:
            "Association type deleted successfully.",
        },

        404: {
          description:
            "Association type not found.",
        },
      },
    },
  },
};

export default associationTypePaths;