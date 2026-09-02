const publicStatePaths = {
  // =====================================
  // Get Public States With Venue Count
  // =====================================

  "/public/states/venue-count": {
    get: {
      tags: ["Public - State"],

      summary: "Get All Public States With Venue Count",

      description:
        "Get all states with the number of approved venues available in each state. States with zero approved venues are also included. Results support search, pagination, and sorting by venue count.",

      parameters: [
        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },

          description: "Page number.",
        },

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 20,
          },

          description: "Number of states per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search state by state name.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: ["venueCount", "state"],

            default: "venueCount",
          },

          description: "Field used to sort states. Default is venueCount.",
        },

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: ["asc", "desc"],

            default: "desc",
          },

          description:
            "Sort order. By default, states with the highest number of approved venues appear first.",
        },
      ],

      responses: {
        200: {
          description: "Public states with venue count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Public states with venue count fetched successfully.",

                data: [
                  {
                    state: "Maharashtra",
                    venueCount: 25,
                  },

                  {
                    state: "Telangana",
                    venueCount: 18,
                  },

                  {
                    state: "Karnataka",
                    venueCount: 12,
                  },

                  {
                    state: "Uttar Pradesh",
                    venueCount: 5,
                  },

                  {
                    state: "Bihar",
                    venueCount: 0,
                  },
                ],

                pagination: {
                  total: 5,
                  page: 1,
                  limit: 20,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        429: {
          description: "Too many requests.",
        },

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  // =====================================
  // Public States With Upcoming Conference Count
  // =====================================

  "/public/states/conference-count": {
    get: {
      tags: ["Public - State"],

      summary: "Get Public States With Upcoming Conference Count",

      description:
        "Get all states that have approved upcoming conferences. Only the upcoming conference count for each state is returned. Conference details are not included in the response. Upcoming conferences are determined using the startDate.",

      parameters: [
        // =====================================
        // Page
        // =====================================

        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            default: 1,
          },

          description: "Page number.",
        },

        // =====================================
        // Limit
        // =====================================

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            maximum: 100,

            default: 20,
          },

          description: "Number of states per page.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public states with conference count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public states with conference count fetched successfully.",

                data: [
                  {
                    state: "Tamil Nadu",

                    upcomingConferenceCount: 21,
                  },

                  {
                    state: "Uttarakhand",

                    upcomingConferenceCount: 2,
                  },

                  {
                    state: "Bihar",

                    upcomingConferenceCount: 1,
                  },
                ],

                pagination: {
                  page: 1,

                  limit: 20,

                  total: 37,

                  totalPages: 2,

                  from: 1,

                  to: 20,

                  hasPreviousPage: false,

                  hasNextPage: true,
                },
              },
            },
          },
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description: "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },

  // =====================================
  // Public States With Upcoming Exhibition Count
  // =====================================

  "/public/states/exhibition-count": {
    get: {
      tags: ["Public - State"],

      summary: "Get Public States With Upcoming Exhibition Count",

      description:
        "Get all states that have approved upcoming exhibitions. Only the upcoming exhibition count for each state is returned. Exhibition details are not included in the response. Upcoming exhibitions are determined using the startDate.",

      parameters: [
        // =====================================
        // Page
        // =====================================

        {
          in: "query",

          name: "page",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            default: 1,
          },

          description: "Page number.",
        },

        // =====================================
        // Limit
        // =====================================

        {
          in: "query",

          name: "limit",

          required: false,

          schema: {
            type: "integer",

            minimum: 1,

            maximum: 100,

            default: 20,
          },

          description: "Number of states per page.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public states with exhibition count fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public states with exhibition count fetched successfully.",

                data: [
                  {
                    state: "Maharashtra",

                    upcomingExhibitionCount: 18,
                  },

                  {
                    state: "Delhi",

                    upcomingExhibitionCount: 7,
                  },

                  {
                    state: "Gujarat",

                    upcomingExhibitionCount: 4,
                  },
                ],

                pagination: {
                  page: 1,

                  limit: 20,

                  total: 25,

                  totalPages: 2,

                  from: 1,

                  to: 20,

                  hasPreviousPage: false,

                  hasNextPage: true,
                },
              },
            },
          },
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description: "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default publicStatePaths;
