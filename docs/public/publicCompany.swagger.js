const publicCompanyPaths = {
  // =====================================
  // Get Public Companies By Company Type
  // =====================================

  "/public/companies/company-type/{companyTypeId}": {
    get: {
      tags: ["Public - Company"],

      summary: "Get Public Companies By Company Type",

      description:
        "Get all approved companies belonging to a specific company type. The response contains only public company information and the total number of upcoming approved exhibitions and conferences for each company.",

      parameters: [
        {
          in: "path",

          name: "companyTypeId",

          required: true,

          schema: {
            type: "string",
          },

          description: "Company Type MongoDB ObjectId.",
        },

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

          description: "Number of companies per page.",
        },

        {
          in: "query",

          name: "search",

          required: false,

          schema: {
            type: "string",
          },

          description: "Search company name or city.",
        },

        {
          in: "query",

          name: "city",

          required: false,

          schema: {
            type: "string",
          },

          description: "Filter companies by city.",
        },

        {
          in: "query",

          name: "stateId",

          required: false,

          schema: {
            type: "string",
          },

          description: "Filter companies by state ID.",
        },

        {
          in: "query",

          name: "featured",

          required: false,

          schema: {
            type: "boolean",
          },

          description: "Filter companies by featured status.",
        },

        {
          in: "query",

          name: "sortBy",

          required: false,

          schema: {
            type: "string",

            enum: [
              "createdAt",
              "companyName",
              "city",
              "featured",
              "upcomingEvents",
            ],

            default: "createdAt",
          },

          description: "Field used to sort companies.",
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

          description: "Sort order.",
        },
      ],

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description: "Public companies fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Public companies fetched successfully.",

                data: [
                  {
                    _id: "68a123456789abcdef123456",

                    companyName: "ABC Exhibitions Pvt Ltd",

                    companyType: {
                      _id: "68a123456789abcdef654321",

                      companyTypeName: "Event Organizer",
                    },

                    state: {
                      _id: "68a123456789abcdef111111",

                      state: "Telangana",
                    },

                    city: "Hyderabad",

                    address: "Madhapur, Hyderabad, Telangana",

                    website: "https://example.com",

                    featured: true,

                    uploadLogo: "https://example.com/company-logo.jpg",

                    upcomingEvents: 12,
                  },
                ],

                pagination: {
                  total: 35,

                  page: 1,

                  limit: 20,

                  totalPages: 2,

                  hasNextPage: true,

                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        // =====================================
        // 400 Bad Request
        // =====================================

        400: {
          description: "Invalid company type ID or state ID.",
        },

        // =====================================
        // 404 Not Found
        // =====================================

        404: {
          description: "Company type not found.",
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
  // Get All Public Companies
  // Excluding Exhibition Organizer & Conference Organizer (PCO)
  // =====================================
  "/public/companies": {
    get: {
      tags: ["Public - Company"],

      summary: "Get All Public Companies (Excluding Exhibition Organizer & Conference Organizer (PCO))",

      description:
        "Get all approved public companies except companies whose company type is Exhibition Organizer or Professional Conference Organiser (PCO). The response contains public company information and the total number of upcoming approved exhibitions and conferences for each company.",

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
          description: "Number of companies per page.",
        },

        {
          in: "query",
          name: "search",
          required: false,
          schema: {
            type: "string",
          },
          description: "Search company name, city, or company type name.",
        },

        {
          in: "query",
          name: "city",
          required: false,
          schema: {
            type: "string",
          },
          description: "Filter companies by city.",
        },

        {
          in: "query",
          name: "stateId",
          required: false,
          schema: {
            type: "string",
          },
          description: "Filter companies by state ID.",
        },

        {
          in: "query",
          name: "featured",
          required: false,
          schema: {
            type: "boolean",
          },
          description: "Filter companies by featured status.",
        },

        {
          in: "query",
          name: "sortBy",
          required: false,
          schema: {
            type: "string",
            enum: [
              "createdAt",
              "companyName",
              "city",
              "featured",
              "upcomingEvents",
            ],
            default: "createdAt",
          },
          description: "Field used to sort companies.",
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
          description: "Sort order.",
        },
      ],

      responses: {
        200: {
          description: "Public companies fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message: "Public companies fetched successfully.",

                data: [
                  {
                    _id: "68a123456789abcdef123456",

                    companyName: "ABC Healthcare Pvt Ltd",

                    companyType: {
                      _id: "68a123456789abcdef111111",

                      companyTypeName: "Healthcare Company",
                    },

                    state: {
                      _id: "68a123456789abcdef222222",

                      state: "Telangana",
                    },

                    city: "Hyderabad",

                    address: "Madhapur, Hyderabad, Telangana",

                    website: "https://example.com",

                    featured: true,

                    uploadLogo: "https://example.com/logo.png",

                    upcomingEvents: 12,
                  },
                ],

                pagination: {
                  total: 25,
                  page: 1,
                  limit: 20,
                  totalPages: 2,
                  hasNextPage: true,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },

        400: {
          description: "Invalid state ID or featured value.",
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
};

export default publicCompanyPaths;
