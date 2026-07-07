import { successExample, errorExample } from "./examples.js";

export const success200 = {
  description: "Request completed successfully.",
  content: {
    "application/json": {
      example: successExample,
    },
  },
};

export const created201 = {
  description: "Resource created successfully.",
  content: {
    "application/json": {
      example: {
        success: true,
        message: "Resource created successfully.",
      },
    },
  },
};

export const badRequest400 = {
  description: "Bad Request.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Bad Request.",
      },
    },
  },
};

export const unauthorized401 = {
  description: "Unauthorized.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Unauthorized.",
      },
    },
  },
};

export const forbidden403 = {
  description: "Forbidden.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Forbidden.",
      },
    },
  },
};

export const notFound404 = {
  description: "Resource not found.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Resource not found.",
      },
    },
  },
};

export const conflict409 = {
  description: "Conflict.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Resource already exists.",
      },
    },
  },
};

export const validation422 = {
  description: "Validation failed.",
  content: {
    "application/json": {
      example: {
        success: false,
        message: "Validation failed.",
      },
    },
  },
};

export const internalServer500 = {
  description: "Internal server error.",
  content: {
    "application/json": {
      example: errorExample,
    },
  },
};