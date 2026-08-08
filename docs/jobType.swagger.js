import { createJobTypeExample, updateJobTypeExample } from "./examples.js";

const jobTypePaths = {
  //==============================
  // Create Job Type
  //==============================
  "/job-types": {
    post: {
      tags: ["Job Type"],

      summary: "Create Job Type",

      description: "Create a new job type. Admin only.",

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
              $ref: "#/components/schemas/CreateJobTypeRequest",
            },

            example: createJobTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Job type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Job type already exists.",
        },
      },
    },

    //==============================
    // Get Job Types
    //==============================
    get: {
      tags: ["Job Type"],

      summary: "Get Job Types",

      description: "Get all job types with search and sorting.",

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

          description: "Search job types by job type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "jobTypeName",
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
          description: "Job types fetched successfully.",

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
                    example: "Job types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/JobType",
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
          description: "Job type fetched successfully.",
        },

        404: {
          description: "Job type not found.",
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
              $ref: "#/components/schemas/UpdateJobTypeRequest",
            },

            example: updateJobTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Job type updated successfully.",
        },

        404: {
          description: "Job type not found.",
        },

        409: {
          description: "Job type already exists.",
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
          description: "Job type deleted successfully.",
        },

        404: {
          description: "Job type not found.",
        },
      },
    },
  },
};

export default jobTypePaths;
