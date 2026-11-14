/**
 * Global error handler middleware.
 * Catches and formats errors into consistent JSON responses.
 */
const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Mongoose validation error (e.g., missing required fields, enum mismatch)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const detailMessages = Object.values(err.errors).map((e) => e.message);
    message = detailMessages.join(', ') || 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for field(s): ${field}`;
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
