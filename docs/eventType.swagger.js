import { createEventTypeExample, updateEventTypeExample } from "./examples.js";

const eventTypePaths = {
  //==============================
  // Create Event Type
  //==============================
  "/event-types": {
    post: {
      tags: ["Event Type"],

      summary: "Create Event Type",

      description: "Create a new event type. Admin only.",

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
              $ref: "#/components/schemas/CreateEventTypeRequest",
            },

            example: createEventTypeExample,
          },
        },
      },

      responses: {
        201: {
          description: "Event type created successfully.",
        },

        400: {
          description: "Validation error.",
        },

        401: {
          description: "Unauthorized.",
        },

        409: {
          description: "Event type already exists.",
        },
      },
    },

    //==============================
    // Get Event Types
    //==============================
    get: {
      tags: ["Event Type"],

      summary: "Get Event Types",

      description: "Get all event types with search and sorting.",

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

          description: "Search event types by event type name.",
        },

        {
          in: "query",

          name: "sortBy",

          schema: {
            type: "string",
            example: "eventTypeName",
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
          description: "Event types fetched successfully.",

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
                    example: "Event types fetched successfully.",
                  },

                  data: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/EventType",
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
  "/event-types/{id}": {
    //==============================
    // Get By ID
    //==============================
    get: {
      tags: ["Event Type"],

      summary: "Get Event Type By ID",

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
          description: "Event type fetched successfully.",
        },

        404: {
          description: "Event type not found.",
        },
      },
    },

    //==============================
    // Update
    //==============================
    put: {
      tags: ["Event Type"],

      summary: "Update Event Type",

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
              $ref: "#/components/schemas/UpdateEventTypeRequest",
            },

            example: updateEventTypeExample,
          },
        },
      },

      responses: {
        200: {
          description: "Event type updated successfully.",
        },

        404: {
          description: "Event type not found.",
        },

        409: {
          description: "Event type already exists.",
        },
      },
    },

    //==============================
    // Delete
    //==============================
    delete: {
      tags: ["Event Type"],

      summary: "Delete Event Type",

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
          description: "Event type deleted successfully.",
        },

        404: {
          description: "Event type not found.",
        },
      },
    },
  },
};

export default eventTypePaths;
