const logger = require('../config/logger');

/**
 * Error Handler Middleware
 * Centralized error handling for all routes
 */
const errorHandlerMiddleware = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandlerMiddleware;
