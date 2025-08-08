/**
 * Simple error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Simple error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle common error types
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 502;
    message = 'Service unavailable';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 504;
    message = 'Request timeout';
  }

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Simple 404 handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  asyncHandler
};
