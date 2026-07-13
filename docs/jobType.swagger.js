import {
  createJobTypeExample,
  updateJobTypeExample,
} from "./examples.js";

const jobTypePaths = {
  //==============================
  // Create Job Type
  //==============================
  "/job-types": {
    post: {
      tags: ["Job Type"],

      summary: "Create Job Type",

      description:
        "Create a new job type. Admin only.",

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
                "#/components/schemas/CreateJobTypeRequest",
            },

            example: createJobTypeExample,
          },
        },
      },

      responses: {
        201: {
          description:
            "Job type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description:
            "Job type already exists.",
        },
      },
    },

    //==============================
    // Get Job Types
    //==============================
    get: {
      tags: ["Job Type"],

      summary: "Get Job Types",

      description:
        "Get paginated job types with search, sorting and pagination.",

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
            "Job types fetched successfully.",
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
  "/job-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Job Type"],

      summary: "Get Job Type By ID",

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
            "Job type fetched successfully.",
        },

        404: {
          description:
            "Job type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Job Type"],

      summary: "Update Job Type",

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
                "#/components/schemas/UpdateJobTypeRequest",
            },

            example: updateJobTypeExample,
          },
        },
      },

      responses: {
        200: {
          description:
            "Job type updated successfully.",
        },

        404: {
          description:
            "Job type not found.",
        },

        409: {
          description:
            "Job type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Job Type"],

      summary: "Delete Job Type",

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
            "Job type deleted successfully.",
        },

        404: {
          description:
            "Job type not found.",
        },
      },
    },
  },
};

export default jobTypePaths;