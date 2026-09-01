const publicConferencePaths = {
  // =====================================
  // Get All Public Conferences
  // =====================================

  "/public/conferences": {
    get: {
      tags: ["Public - Conference"],

      summary: "Get All Public Conferences",

      description:
        "Get all approved public conferences for the public conference listing. The response contains only the information required for conference cards, including conference name, short name, dates, logo, featured status, conference location, and organizer information.",

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

          description:
            "Page number.",
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

          description:
            "Number of conferences per page.",
        },

        // =====================================
        // Search
        // =====================================

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Search conferences by conference name or city.",
        },

        // =====================================
        // City
        // =====================================

        {
          in: "query",

          name: "city",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Filter conferences by conference city.",
        },

        // =====================================
        // State ID
        // =====================================

        {
          in: "query",

          name: "stateId",

          required: false,

          schema: {
            type: "string",
          },

          description:
            "Filter conferences by conference state ID.",
        },

        // =====================================
        // Featured
        // =====================================

        {
          in: "query",

          name: "featured",

          required: false,

          schema: {
            type: "string",

            enum: [
              "true",
              "false",
            ],
          },

          description:
            "Filter conferences by featured status.",
        },

        // =====================================
        // Sort By
        // =====================================

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "startDate",
              "endDate",
              "conferenceName",
              "city",
              "featured",
              "createdAt",
            ],

            default: "startDate",
          },

          description:
            "Secondary sorting field. Featured conferences are always displayed first.",
        },

        // =====================================
        // Order
        // =====================================

        {
          in: "query",

          name: "order",

          required: false,

          schema: {
            type: "string",

            enum: [
              "asc",
              "desc",
            ],

            default: "asc",
          },

          description:
            "Sort order for the selected secondary sorting field.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public conferences fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public conferences fetched successfully.",

                data: [
                  {
                    _id:
                      "6a8c195bab4c2895dd13af8f",

                    conferenceName:
                      "45th Annual Conference of the Association of Radiation Oncologists of India - AROICON 2025",

                    conferenceShortName:
                      "AROICON 2025",

                    startDate:
                      "2025-07-27T18:30:00.000Z",

                    endDate:
                      "2025-07-29T18:30:00.000Z",

                    organizer: {
                      _id:
                        "6a7ec299b5cb346da1185024",

                      companyName:
                        "India Trade Promotion Organization, New Delhi",

                      state: {
                        _id:
                          "6a75e6defcc5048229d4673c",

                        state:
                          "Madhya Pradesh",
                      },

                      city:
                        "New Delhi",

                      address:
                        "New Delhi, India",
                    },

                    city:
                      "Bhopal",

                    state: {
                      _id:
                        "6a75e6defcc5048229d4673c",

                      state:
                        "Madhya Pradesh",
                    },

                    uploadConferenceLogo:
                      "https://expocon-bucket.s3.eu-west-2.amazonaws.com/conference-logos/example.png",

                    featured:
                      true,
                  },

                  {
                    _id:
                      "6a8c195bab4c2895dd13af90",

                    conferenceName:
                      "Advanced Automotive Battery Conference Europe 2024",

                    conferenceShortName:
                      "AABC Europe 2024",

                    startDate:
                      "2024-07-27T18:30:00.000Z",

                    endDate:
                      "2024-07-29T18:30:00.000Z",

                    organizer: {
                      _id:
                        "6a7ec299b5cb346da1185025",

                      companyName:
                        "India Trade Promotion Organization, New Delhi",

                      state: {
                        _id:
                          "6a75e6defcc5048229d4673c",

                        state:
                          "Madhya Pradesh",
                      },

                      city:
                        "New Delhi",

                      address:
                        "New Delhi, India",
                    },

                    city:
                      "Bhopal",

                    state: {
                      _id:
                        "6a75e6defcc5048229d4673c",

                      state:
                        "Madhya Pradesh",
                    },

                    uploadConferenceLogo:
                      "https://expocon-bucket.s3.eu-west-2.amazonaws.com/conference-logos/example.png",

                    featured:
                      false,
                  },

                  {
                    _id:
                      "6a8c195bab4c2895dd13af91",

                    conferenceName:
                      "World Food India 2025",

                    conferenceShortName:
                      "WFI 2025",

                    startDate:
                      "2025-10-15T18:30:00.000Z",

                    endDate:
                      "2025-10-18T18:30:00.000Z",

                    organizer: {
                      _id:
                        "6a7ec299b5cb346da1185026",

                      companyName:
                        "Ministry of Food Processing Industries",

                      state: {
                        _id:
                          "6a75e6defcc5048229d4673c",

                        state:
                          "Delhi",
                      },

                      city:
                        "New Delhi",

                      address:
                        "New Delhi, India",
                    },

                    city:
                      "New Delhi",

                    state: {
                      _id:
                        "6a75e6defcc5048229d4673c",

                      state:
                        "Delhi",
                    },

                    uploadConferenceLogo:
                      "https://expocon-bucket.s3.eu-west-2.amazonaws.com/conference-logos/example.png",

                    featured:
                      false,
                  },
                ],

                pagination: {
                  page: 1,

                  limit: 20,

                  total: 285,

                  totalPages: 15,

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
        // 400 Bad Request
        // =====================================

        400: {
          description:
            "Invalid state ID.",
        },

        // =====================================
        // 429 Too Many Requests
        // =====================================

        429: {
          description:
            "Too many requests.",
        },

        // =====================================
        // 500 Server Error
        // =====================================

        500: {
          description:
            "Internal server error.",
        },
      },
    },
  },
};

export default publicConferencePaths;