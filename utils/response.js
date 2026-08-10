// ==========================================
// Success Response
// ==========================================

export const successResponse = (
  res,
  {
    statusCode = 200,
    message = "Success",
    data = null,
    pagination = null,
  } = {},
) => {
  const response = {
    success: true,
    message,
    data,
  };

  // Add pagination when provided
  if (pagination !== null && pagination !== undefined) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};


// ==========================================
// Error Response
// ==========================================

export const errorResponse = (
  res,
  {
    statusCode = 500,
    message = "Something went wrong.",
    errors = null,
    data = null,
  } = {},
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    data,
  });
};