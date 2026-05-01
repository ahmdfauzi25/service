const EmployeeModel = require('../models/EmployeeModel');

const EmployeeControllers = (module.exports = {
  List: async function (req, res) {
    var apiResult = {};
    try {
      var getEmployeeList = await EmployeeModel.List().then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getEmployeeList,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: 'Operation Fail',
        error: error.message,
      };
    }
    res.status(200).json(apiResult);
  },

  Detail: async function (req, res) {
    var apiResult = {};
    try {
      var id = req.body.id || req.body.id_m_employee || req.params.id;
      var getEmployeeDetail = await EmployeeModel.GetById(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getEmployeeDetail,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: 'Operation Fail',
        error: error.message,
      };
    }
    res.status(200).json(apiResult);
  },

  Department: async function (req, res) {
    var apiResult = {};
    try {
      var department = req.params.department || req.body.department;
      var getEmployeeList = await EmployeeModel.GetByDepartment(department).then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getEmployeeList,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: 'Operation Fail',
        error: error.message,
      };
    }
    res.status(200).json(apiResult);
  },

  Create: async function (req, res) {
    var apiResult = {};
    try {
      var { user_id, employee_id, department, position, manager_id, hire_date, status } = req.body;

      const checkEmployee = await EmployeeModel.GetByEmployeeId(employee_id).then(({ rows }) => rows[0]);
      if (checkEmployee) throw 'Employee sudah terdaftar';

      const dtInsert = await EmployeeModel.Insert({
        user_id,
        employee_id,
        department,
        position,
        manager_id,
        hire_date,
        status: status || 'active',
      }).then(({ rows }) => rows[0]);

      apiResult = {
        success: true,
        message: 'Operation Success',
        data: dtInsert,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    res.status(200).json(apiResult);
  },

  Update: async function (req, res) {
    var apiResult = {};
    try {
      var id = req.body.id || req.body.id_m_employee || req.params.id;
      var { department, position, manager_id, status } = req.body;

      const getEmployee = await EmployeeModel.GetById(id).then(({ rows }) => rows[0]);
      if (!getEmployee) throw 'Data tidak ditemukan';

      const dtUpdate = await EmployeeModel.Update(
        {
          department,
          position,
          manager_id,
          status,
          updated_at: new Date(),
        },
        id
      ).then(({ rows }) => rows[0]);

      apiResult = {
        success: true,
        message: 'Operation Success',
        data: dtUpdate,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    res.status(200).json(apiResult);
  },

  Delete: async function (req, res) {
    var apiResult = {};
    try {
      var id = req.body.id || req.body.id_m_employee || req.params.id;
      const deleteEmployeeById = await EmployeeModel.Delete(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: deleteEmployeeById,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: 'Operation Fail',
        error: error.message,
      };
    }
    res.status(200).json(apiResult);
  },

  getEmployees: async function (req, res) {
    return EmployeeControllers.List(req, res);
  },
  getEmployeeById: async function (req, res) {
    return EmployeeControllers.Detail(req, res);
  },
  getByDepartment: async function (req, res) {
    return EmployeeControllers.Department(req, res);
  },
  createEmployee: async function (req, res) {
    return EmployeeControllers.Create(req, res);
  },
  updateEmployee: async function (req, res) {
    return EmployeeControllers.Update(req, res);
  },
  deleteEmployee: async function (req, res) {
    return EmployeeControllers.Delete(req, res);
  },
});
