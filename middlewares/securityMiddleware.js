const logger = require('../config/logger');

/**
 * Security Middleware
 * Implements basic security checks
 */
const securityMiddleware = (req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};

module.exports = securityMiddleware;
