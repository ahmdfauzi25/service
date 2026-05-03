/**
 * Audit Context Middleware
 * Adds audit context to each request (user, timestamp, IP, etc.)
 * NOTE: must be placed AFTER body-parser so req.body is already populated.
 */
const auditContextMiddleware = (req, res, next) => {
  req.auditContext = {
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    // req.body is safe to read here because body-parser runs first
    body: req.method !== 'GET' ? req.body : undefined,
  };

  next();
};

module.exports = auditContextMiddleware;
