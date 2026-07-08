// Success Response

export const successResponse = (
  res,
  { statusCode = 200, message = "Success", data = null, meta } = {},
) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta !== undefined) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Error Response

export const errorResponse = (
  res,
  { statusCode = 500, message = "Something went wrong.", errors = null } = {},
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
