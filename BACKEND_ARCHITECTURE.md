# Service Platform Backend Architecture

Complete backend service structure with controllers, models, routes, middlewares, and helpers.

## Project Structure

```
service/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies
├── .env                            # Environment variables
├── .env.local                      # Local environment
├── .env.production                 # Production environment
│
├── config/                         # Configuration files
│   ├── logger.js                   # Winston logger setup
│   ├── database.js                 # Database configuration
│   └── api.js                      # API configuration
│
├── middlewares/                    # Express middlewares
│   ├── authMiddleware.js           # JWT authentication
│   ├── auditContextMiddleware.js   # Audit context logging
│   ├── securityMiddleware.js       # Security headers
│   ├── errorHandlerMiddleware.js   # Global error handling
│   └── validateRequest.js          # Request validation
│
├── routes/                         # API routes
│   ├── ServiceRoutes.js            # Main route aggregator
│   ├── AuthRoutes.js               # Authentication endpoints
│   ├── UserRoutes.js               # User endpoints
│   ├── EmployeeRoutes.js           # Employee endpoints
│   └── CompanyRoutes.js            # Company endpoints
│
├── controllers/                    # Business logic
│   ├── AuthControllers.js          # Authentication logic
│   ├── UserControllers.js          # User operations
│   ├── EmployeeControllers.js      # Employee operations
│   └── CompanyControllers.js       # Company operations
│
├── models/                         # Database models
│   ├── UserModel.js                # User model & queries
│   ├── EmployeeModel.js            # Employee model & queries
│   ├── CompanyModel.js             # Company model & queries
│   └── AuditTrailModel.js          # Audit trail model
│
├── helpers/                        # Utility functions
│   ├── ResponseGenerator.js        # Standard response format
│   ├── SecurityHandlers.js         # Security utilities (hash, JWT, encrypt)
│   ├── AuditTrailHelpers.js        # Audit logging
│   └── DatabaseHelpers.js          # Common DB operations
│
├── logs/                           # Application logs
│   ├── combined.log                # All logs
│   └── error.log                   # Error logs only
│
└── key/                            # Encryption keys (keep secure)
```

## API Endpoints

### Authentication
- `POST /svc/auth/login` - Login user
- `POST /svc/auth/register` - Register new user
- `POST /svc/auth/refresh` - Refresh JWT token
- `POST /svc/auth/logout` - Logout user

### Users
- `GET /svc/users` - Get all users (paginated)
- `GET /svc/users/:id` - Get user by ID
- `GET /svc/users/search?q=query` - Search users
- `POST /svc/users` - Create new user
- `PUT /svc/users/:id` - Update user
- `DELETE /svc/users/:id` - Delete user

### Employees
- `GET /svc/employees` - Get all employees (paginated)
- `GET /svc/employees/:id` - Get employee by ID
- `GET /svc/employees/department/:department` - Get by department
- `POST /svc/employees` - Create employee
- `PUT /svc/employees/:id` - Update employee
- `DELETE /svc/employees/:id` - Delete employee

### Companies
- `GET /svc/companies` - Get all companies (paginated)
- `GET /svc/companies/:id` - Get company by ID
- `GET /svc/companies/search?q=query` - Search companies
- `POST /svc/companies` - Create company
- `PUT /svc/companies/:id` - Update company
- `DELETE /svc/companies/:id` - Delete company

### Health Check
- `GET /svc/health` - Service health status
- `GET /health` - Application health status

## Models

### UserModel
```javascript
{
  id: integer,
  username: string (unique),
  email: string (unique),
  password_hash: string,
  first_name: string,
  last_name: string,
  phone: string,
  status: 'active' | 'inactive',
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp (soft delete)
}
```

### EmployeeModel
```javascript
{
  id: integer,
  user_id: integer (FK),
  employee_id: string (unique),
  department: string,
  position: string,
  manager_id: integer,
  hire_date: date,
  status: 'active' | 'inactive',
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp
}
```

### CompanyModel
```javascript
{
  id: integer,
  name: string,
  registration_number: string (unique),
  email: string,
  phone: string,
  website: string,
  address: string,
  city: string,
  country: string,
  status: 'active' | 'inactive',
  created_at: timestamp,
  updated_at: timestamp,
  deleted_at: timestamp
}
```

### AuditTrailModel
```javascript
{
  id: integer,
  user_id: integer (FK),
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  module: string,
  description: text,
  old_values: jsonb,
  new_values: jsonb,
  ip_address: string,
  user_agent: string,
  created_at: timestamp
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-05-02T12:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "timestamp": "2024-05-02T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "details": null,
  "timestamp": "2024-05-02T12:00:00.000Z"
}
```

## Database Setup

### Create Tables
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  manager_id INTEGER,
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20),
  website VARCHAR(255),
  address VARCHAR(500),
  city VARCHAR(100),
  country VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Audit trails table
CREATE TABLE audit_trails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  module VARCHAR(100) NOT NULL,
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb service_db

# Run schema migrations (create tables)
# See "Database Setup" section above
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:3010`

### 5. Production Build
```bash
npm start
```

## Key Features

✅ **RESTful API** - Standard REST endpoints for CRUD operations
✅ **Authentication** - JWT-based authentication with token refresh
✅ **Authorization** - Middleware-based route protection
✅ **Audit Logging** - Track all user actions
✅ **Error Handling** - Centralized error handling middleware
✅ **Validation** - Request validation middleware
✅ **Security** - Password hashing, encryption, security headers
✅ **Logging** - Winston logger for application logs
✅ **Pagination** - Built-in pagination support
✅ **Search** - Full-text search on key models
✅ **Soft Deletes** - Logical deletion with deleted_at timestamp

## Helper Functions

### ResponseGenerator
```javascript
ResponseGenerator.success(data, message, statusCode)
ResponseGenerator.error(message, statusCode, details)
ResponseGenerator.paginated(data, total, page, limit, message)
```

### SecurityHandlers
```javascript
await SecurityHandlers.hashPassword(password)
await SecurityHandlers.comparePassword(password, hash)
SecurityHandlers.generateToken(payload, expiresIn)
SecurityHandlers.verifyToken(token)
SecurityHandlers.encrypt(data)
SecurityHandlers.decrypt(encrypted)
SecurityHandlers.generateRandomToken(length)
```

### AuditTrailHelpers
```javascript
await AuditTrailHelpers.logAuditTrail(db, auditData)
await AuditTrailHelpers.getAuditTrails(db, filters)
```

### DatabaseHelpers
```javascript
await DatabaseHelpers.getPaginated(db, query, countQuery, params, page, limit)
await DatabaseHelpers.getById(db, table, id)
await DatabaseHelpers.create(db, table, data)
await DatabaseHelpers.update(db, table, id, data)
await DatabaseHelpers.delete(db, table, id)
```

## Best Practices

✅ Use authentication middleware on protected routes
✅ Log important actions for audit trail
✅ Always use soft deletes (deleted_at) instead of hard deletes
✅ Validate input data using validate middleware
✅ Return consistent response format
✅ Handle errors gracefully
✅ Use parameterized queries to prevent SQL injection
✅ Keep sensitive data out of logs
✅ Use HTTPS in production
✅ Regularly rotate encryption keys
✅ Monitor and archive old logs

## Development Workflow

1. Define API endpoint in routes
2. Create controller method with business logic
3. Use model for database operations
4. Add middleware for authentication/validation
5. Log important actions to audit trail
6. Test with Postman or similar tool
7. Deploy to production

## Troubleshooting

**Database Connection Error**
- Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD in .env
- Ensure PostgreSQL service is running
- Verify database exists

**Authentication Error**
- Check SECRET_KEY in .env
- Verify token is passed in Authorization header
- Ensure token hasn't expired

**Port Already in Use**
- Change PORT in .env
- Or kill process using the port

**Logging Issues**
- Check logs/ directory permissions
- Verify LOG_LEVEL in .env
- Ensure logs directory exists
