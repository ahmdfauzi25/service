# Service Platform Backend

Enterprise-grade backend service with complete API structure, authentication, and data management capabilities.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

### Development
```bash
npm run dev
```

Server starts at `http://localhost:3010`

## 📁 Project Structure

The service follows a layered architecture pattern:

- **app.js** - Application entry point
- **controllers/** - Business logic and request handling
- **models/** - Database models and queries
- **routes/** - API endpoint definitions
- **middlewares/** - Express middlewares for auth, validation, error handling
- **helpers/** - Utility functions and helpers
- **config/** - Configuration files (logger, database, API)
- **logs/** - Application logs

## 🔗 API Endpoints

### Authentication
```
POST   /svc/auth/login          - Login user
POST   /svc/auth/register       - Register new user
POST   /svc/auth/refresh        - Refresh JWT token
POST   /svc/auth/logout         - Logout user
```

### Users
```
GET    /svc/users               - List all users (paginated)
GET    /svc/users/:id           - Get user details
GET    /svc/users/search        - Search users
POST   /svc/users               - Create new user
PUT    /svc/users/:id           - Update user
DELETE /svc/users/:id           - Delete user
```

### Employees
```
GET    /svc/employees           - List all employees
GET    /svc/employees/:id       - Get employee details
GET    /svc/employees/dept/:dept - Get by department
POST   /svc/employees           - Create employee
PUT    /svc/employees/:id       - Update employee
DELETE /svc/employees/:id       - Delete employee
```

### Companies
```
GET    /svc/companies           - List all companies
GET    /svc/companies/:id       - Get company details
GET    /svc/companies/search    - Search companies
POST   /svc/companies           - Create company
PUT    /svc/companies/:id       - Update company
DELETE /svc/companies/:id       - Delete company
```

## 📊 Database Models

### Users
Store user accounts with authentication details and profile information.

### Employees
Employee records linked to users with department and position information.

### Companies
Company information including registration and contact details.

### Audit Trails
Complete audit log of all user actions for compliance.

## 🔐 Security Features

✅ **JWT Authentication** - Token-based API access
✅ **Password Hashing** - bcryptjs for secure passwords
✅ **Data Encryption** - AES-256 encryption for sensitive data
✅ **CORS Headers** - Cross-origin request handling
✅ **Security Headers** - XSS, frame, and content-type protection
✅ **Audit Logging** - Track all user actions
✅ **Soft Deletes** - Logical deletion with recovery option

## 🛠 Configuration

### Environment Variables

```env
# Server
ENV=local
PORT=3010
API_URL=svc/
VERSION=v1

# Security
KEY_ENC=Your32CharacterEncryptionKey
SECRET_KEY=YourJWTSecretKey

# Database
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=service_db
DB_USERNAME=postgres
DB_PASSWORD=password
CONNECTIONLIMIT=10

# Other
ACQRTETIMEOUT=30000
LOG_LEVEL=info
```

## 📝 Controllers

### UserController
- `getUsers()` - List users with pagination
- `getUserById()` - Get single user
- `createUser()` - Create new user
- `updateUser()` - Update user info
- `deleteUser()` - Delete user
- `searchUsers()` - Search by username/email

### EmployeeController
- `getEmployees()` - List employees
- `getEmployeeById()` - Get single employee
- `createEmployee()` - Create employee
- `updateEmployee()` - Update employee
- `deleteEmployee()` - Delete employee
- `getByDepartment()` - Filter by department

### CompanyController
- `getCompanies()` - List companies
- `getCompanyById()` - Get single company
- `createCompany()` - Create company
- `updateCompany()` - Update company
- `deleteCompany()` - Delete company
- `searchCompanies()` - Search companies

### AuthController
- `login()` - User login with credentials
- `register()` - New user registration
- `refreshToken()` - Refresh JWT token
- `logout()` - User logout

## 🚦 Middlewares

### authMiddleware
Verifies JWT token from Authorization header before allowing access to protected routes.

### auditContextMiddleware
Captures request context (IP, timestamp, user agent) for audit logging.

### securityMiddleware
Adds security headers to all responses.

### errorHandlerMiddleware
Centralized error handling with consistent error responses.

### validateRequest
Validates incoming request data based on schemas.

## 🔧 Helper Functions

### ResponseGenerator
Generates standardized API responses:
- `success()` - Successful response
- `error()` - Error response
- `paginated()` - Paginated data response

### SecurityHandlers
Security utilities:
- `hashPassword()` - Hash passwords with bcrypt
- `comparePassword()` - Verify password hash
- `generateToken()` - Create JWT token
- `verifyToken()` - Verify JWT token
- `encrypt()` - Encrypt data
- `decrypt()` - Decrypt data

### AuditTrailHelpers
Audit logging:
- `logAuditTrail()` - Log user action
- `getAuditTrails()` - Retrieve audit logs

### DatabaseHelpers
Common database operations:
- `getPaginated()` - Get paginated results
- `getById()` - Get record by ID
- `create()` - Create new record
- `update()` - Update record
- `delete()` - Delete record

## 📋 Request/Response Examples

### Login Request
```bash
POST /svc/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "email": "user@example.com"
    }
  },
  "timestamp": "2024-05-02T12:00:00Z"
}
```

### Get Users Request
```bash
GET /svc/users?page=1&limit=10
Authorization: Bearer eyJhbGc...
```

### Get Users Response
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "timestamp": "2024-05-02T12:00:00Z"
}
```

## 🗄 Database Setup

### Create Database
```bash
createdb service_db
psql service_db < schema.sql
```

### Tables
- `users` - User accounts
- `employees` - Employee records
- `companies` - Company information
- `audit_trails` - Action audit log

## 📚 Scripts

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm test         # Run tests (if configured)
```

## 🐛 Troubleshooting

**Database Connection Failed**
- Verify PostgreSQL is running
- Check DB credentials in .env
- Ensure database exists

**Port Already in Use**
- Change PORT in .env
- Or kill the process: `lsof -ti:3010 | xargs kill -9`

**JWT Token Invalid**
- Check SECRET_KEY matches
- Ensure token in Authorization header
- Verify token hasn't expired

**Audit Logs Missing**
- Check logs/ directory exists
- Verify user_id is provided
- Ensure database audit_trails table exists

## 📖 Documentation

- [Backend Architecture](BACKEND_ARCHITECTURE.md) - Detailed architecture guide
- [Project Structure](PROJECT_STRUCTURE.md) - Complete folder structure
- [API Reference](#-api-endpoints) - Full API endpoints

## 🔄 Development Workflow

1. **Create Route** - Define endpoint in routes/
2. **Create Controller** - Add business logic
3. **Create/Use Model** - Database operations
4. **Add Middleware** - Authentication/validation
5. **Test** - Use Postman to test
6. **Deploy** - Push to production

## 🚀 Deployment

### Production Setup
```bash
# Update .env with production values
cp .env.production .env

# Install dependencies
npm install --production

# Start server
npm start
```

### Docker
```bash
docker build -t service-api .
docker run -p 3010:3010 service-api
```

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **winston** - Logging
- **cors** - CORS middleware
- **body-parser** - Request parsing
- **compression** - Response compression
- **dotenv** - Environment variables

## 📄 License

ISC

## 👥 Author

Development Team

---

For detailed backend architecture information, see [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md)
