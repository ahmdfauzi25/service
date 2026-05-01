/**
 * Audit Context Middleware
 * Adds audit context to each request (user, timestamp, IP, etc.)
 */
const auditContextMiddleware = (req, res, next) => {
  req.auditContext = {
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  };

  // Store original body for audit logging
  if (req.method !== 'GET') {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      req.auditContext.body = data;
      next();
    });
  } else {
    next();
  }
};

module.exports = auditContextMiddleware;
