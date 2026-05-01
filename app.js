const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cors = require('cors');

// Import middlewares
const securityMiddleware = require('./middlewares/securityMiddleware');
const auditContextMiddleware = require('./middlewares/auditContextMiddleware');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

// Import routes
const ServiceRoutes = require('./routes/ServiceRoutes');

const app = express();
const server = require('http').createServer(app);

// Middlewares
app.use(compression());
app.use(cors());
app.use(auditContextMiddleware);
app.use(morgan('combined'));

app.use(
  bodyParser.text({
    type: 'application/xml',
    limit: '10mb',
  })
);
app.use(
  bodyParser.json({
    extended: true,
    limit: '10mb',
  })
);

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With'
  );
  if (req.method === 'OPTIONS') {
    return res.json(200);
  }
  return next();
});

// IP Address
app.use((req, res, next) => {
  req.ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
  return next();
});

// Security middleware
app.use(securityMiddleware);

// Initialize routes
ServiceRoutes.routesConfig(appp);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler middleware
app.use(errorHandlerMiddleware);

// Server startup
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.ENV}`);
});

module.exports = { app, server };
