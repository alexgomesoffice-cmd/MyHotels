/**
 * Global error handling middleware
 * Prevents information leakage and provides consistent error responses
 */

export const globalErrorHandler = (err, req, res, next) => {
  // Log full error for debugging (in production, use proper logging service)
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user_id: req.user?.user_id,
  });

  // Default error response
  let statusCode = 500;
  let message = "An error occurred. Please try again later.";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message || "Validation failed";
  } else if (err.name === "UnauthorizedError" || err.message === "Unauthorized") {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.message === "Forbidden" || err.statusCode === 403) {
    statusCode = 403;
    message = "Access forbidden";
  } else if (err.statusCode === 409) {
    statusCode = 409;
    message = err.message || "Resource conflict";
  } else if (err.statusCode === 404 || err.message === "Not found") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.message.includes("FOREIGN KEY")) {
    statusCode = 400;
    message = "Cannot perform this operation due to related records";
  } else if (err.message.includes("Duplicate entry")) {
    statusCode = 409;
    message = "This record already exists";
  }

  // Send safe error response (never expose stack trace in production)
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
};
