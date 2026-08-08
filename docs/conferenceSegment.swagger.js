import {
  createConferenceSegmentExample,
  updateConferenceSegmentExample,
} from "./examples.js";

const conferenceSegmentPaths = {
  //==============================
  // Create Conference Segment
  //==============================
  "/conference-segments": {
    post: {
      tags: ["Conference Segment"],

      summary: "Create Conference Segment",

      description: "Create a new conference segment. Admin only.",

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
              $ref: "#/components/schemas/CreateConferenceSegmentRequest",
            },

            example: createConferenceSegmentExample,
          },
        },
      },

      responses: {
        201: {
          description: "Conference segment created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Conference segment already exists.",
        },
      },
    },

    //==============================
    // Get Conference Segments
    //==============================
    get: {
      tags: ["Conference Segment"],

      summary: "Get Conference Segments",

      description: "Get all conference segments with search and sorting.",

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

          description: "Search conference segments by segment name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "conferenceSegmentName",
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
          description: "Conference segments fetched successfully.",

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
                    example: "Conference segments fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/ConferenceSegment",
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
  "/conference-segments/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Conference Segment"],

      summary: "Get Conference Segment By ID",

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
          description: "Conference segment fetched successfully.",
        },

        404: {
          description: "Conference segment not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Conference Segment"],

      summary: "Update Conference Segment",

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
              $ref: "#/components/schemas/UpdateConferenceSegmentRequest",
            },

            example: updateConferenceSegmentExample,
          },
        },
      },

      responses: {
        200: {
          description: "Conference segment updated successfully.",
        },

        404: {
          description: "Conference segment not found.",
        },

        409: {
          description: "Conference segment already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Conference Segment"],

      summary: "Delete Conference Segment",

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
          description: "Conference segment deleted successfully.",
        },

        404: {
          description: "Conference segment not found.",
        },
      },
    },
  },
};

export default conferenceSegmentPaths;
