const SecurityHandlers = require('../helpers/SecurityHandlers');
const UserControllers = require('../controllers/UserControllers');
const EmployeeControllers = require('../controllers/EmployeeControllers');
const CompanyControllers = require('../controllers/CompanyControllers');
const AuthControllers = require('../controllers/AuthControllers');

const baseUrl = '/' + process.env.API_URL;

exports.routesConfig = function (app) {
  // ============================================================
  // INDEX / HEALTH CHECK
  // ============================================================
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Service Platform API',
      environment: process.env.ENV,
      version: process.env.VERSION,
      timestamp: new Date(),
    });
  });

  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date(),
      environment: process.env.ENV,
    });
  });

  app.get(baseUrl + 'health', (req, res) => {
    res.json({
      success: true,
      status: 'ok',
      timestamp: new Date(),
      message: 'Service is running',
    });
  });

  // ============================================================
  // AUTHENTICATION ROUTES
  // ============================================================

  // Login - No token required
  app.post(baseUrl + 'auth/login', AuthControllers.login);

  // Register - No token required
  app.post(baseUrl + 'auth/register', AuthControllers.register);

  // Refresh Token
  app.post(baseUrl + 'auth/refresh', SecurityHandlers.verifyToken, AuthControllers.refreshToken);

  // Logout
  app.post(baseUrl + 'auth/logout', SecurityHandlers.verifyToken, AuthControllers.logout);

  // Verify Token
  app.post(baseUrl + 'token/verify', SecurityHandlers.verifyToken, AuthControllers.login);

  // ============================================================
  // USER ROUTES
  // ============================================================

  // Get all users
  app.get(baseUrl + 'user/list', SecurityHandlers.verifyToken, UserControllers.getUsers);
  app.post(baseUrl + 'user/list', SecurityHandlers.verifyToken, UserControllers.getUsers);

  // Get user by ID
  app.get(baseUrl + 'user/:id', SecurityHandlers.verifyToken, UserControllers.getUserById);
  app.post(baseUrl + 'user/show', SecurityHandlers.verifyToken, UserControllers.getUserById);

  // Search users
  app.get(baseUrl + 'user/search', SecurityHandlers.verifyToken, UserControllers.searchUsers);
  app.post(baseUrl + 'user/search', SecurityHandlers.verifyToken, UserControllers.searchUsers);

  // Create user
  app.post(baseUrl + 'user/create', SecurityHandlers.verifyToken, UserControllers.createUser);

  // Update user
  app.put(baseUrl + 'user/:id', SecurityHandlers.verifyToken, UserControllers.updateUser);
  app.post(baseUrl + 'user/update', SecurityHandlers.verifyToken, UserControllers.updateUser);

  // Delete user
  app.delete(baseUrl + 'user/:id', SecurityHandlers.verifyToken, UserControllers.deleteUser);
  app.post(baseUrl + 'user/delete', SecurityHandlers.verifyToken, UserControllers.deleteUser);

  // ============================================================
  // EMPLOYEE ROUTES
  // ============================================================

  // Get all employees
  app.get(baseUrl + 'employee/list', SecurityHandlers.verifyToken, EmployeeControllers.getEmployees);
  app.post(baseUrl + 'employee/list', SecurityHandlers.verifyToken, EmployeeControllers.getEmployees);

  // Get employee by ID
  app.get(baseUrl + 'employee/:id', SecurityHandlers.verifyToken, EmployeeControllers.getEmployeeById);
  app.post(baseUrl + 'employee/show', SecurityHandlers.verifyToken, EmployeeControllers.getEmployeeById);
  app.post(baseUrl + 'employee/detail', SecurityHandlers.verifyToken, EmployeeControllers.getEmployeeById);

  // Get employees by department
  app.get(baseUrl + 'employee/department/:department', SecurityHandlers.verifyToken, EmployeeControllers.getByDepartment);
  app.post(baseUrl + 'employee/department', SecurityHandlers.verifyToken, EmployeeControllers.getByDepartment);

  // Create employee
  app.post(baseUrl + 'employee/create', SecurityHandlers.verifyToken, EmployeeControllers.createEmployee);

  // Update employee
  app.put(baseUrl + 'employee/:id', SecurityHandlers.verifyToken, EmployeeControllers.updateEmployee);
  app.post(baseUrl + 'employee/update', SecurityHandlers.verifyToken, EmployeeControllers.updateEmployee);

  // Delete employee
  app.delete(baseUrl + 'employee/:id', SecurityHandlers.verifyToken, EmployeeControllers.deleteEmployee);
  app.post(baseUrl + 'employee/delete', SecurityHandlers.verifyToken, EmployeeControllers.deleteEmployee);

  // ============================================================
  // COMPANY ROUTES
  // ============================================================

  // Get all companies
  app.get(baseUrl + 'company/list', SecurityHandlers.verifyToken, CompanyControllers.getCompanies);
  app.post(baseUrl + 'company/list', SecurityHandlers.verifyToken, CompanyControllers.getCompanies);

  // Get company by ID
  app.get(baseUrl + 'company/:id', SecurityHandlers.verifyToken, CompanyControllers.getCompanyById);
  app.post(baseUrl + 'company/show', SecurityHandlers.verifyToken, CompanyControllers.getCompanyById);
  app.post(baseUrl + 'company/detail', SecurityHandlers.verifyToken, CompanyControllers.getCompanyById);

  // Search companies
  app.get(baseUrl + 'company/search', SecurityHandlers.verifyToken, CompanyControllers.searchCompanies);
  app.post(baseUrl + 'company/search', SecurityHandlers.verifyToken, CompanyControllers.searchCompanies);

  // Create company
  app.post(baseUrl + 'company/create', SecurityHandlers.verifyToken, CompanyControllers.createCompany);

  // Update company
  app.put(baseUrl + 'company/:id', SecurityHandlers.verifyToken, CompanyControllers.updateCompany);
  app.post(baseUrl + 'company/update', SecurityHandlers.verifyToken, CompanyControllers.updateCompany);

  // Delete company
  app.delete(baseUrl + 'company/:id', SecurityHandlers.verifyToken, CompanyControllers.deleteCompany);
  app.post(baseUrl + 'company/delete', SecurityHandlers.verifyToken, CompanyControllers.deleteCompany);

  // ============================================================
  // 404 HANDLER
  // ============================================================
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      path: req.path,
      method: req.method,
    });
  });
};
