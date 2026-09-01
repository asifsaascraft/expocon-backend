const publicCompanyTypePaths = {
  // =====================================
  // Get All Public Company Types
  // =====================================

  "/public/company-types": {
    get: {
      tags: ["Public - Company Type"],

      summary: "Get All Public Company Types",

      description:
        "Get all company types available for public use. Company types are returned alphabetically by company type name.",

      responses: {
        // =====================================
        // 200 Success
        // =====================================

        200: {
          description:
            "Public company types fetched successfully.",

          content: {
            "application/json": {
              example: {
                success: true,

                message:
                  "Public company types fetched successfully.",

                data: [
                  {
                    _id: "68820d5b63ab9f0a11111111",

                    companyTypeName:
                      "Association",
                  },

                  {
                    _id: "68820d5b63ab9f0a22222222",

                    companyTypeName:
                      "Event Management Company",
                  },

                  {
                    _id: "68820d5b63ab9f0a33333333",

                    companyTypeName:
                      "Exhibition Organizer",
                  },

                  {
                    _id: "68820d5b63ab9f0a44444444",

                    companyTypeName:
                      "PCO",
                  },
                ],
              },
            },
          },
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

export default publicCompanyTypePaths;