const UserModel = require('../models/UserModel');
const SecurityHandlers = require('../helpers/SecurityHandlers');

const UserControllers = (module.exports = {
  List: async function (req, res) {
    var apiResult = {};
    try {
      var getUserList = await UserModel.List().then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getUserList,
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

  Show: async function (req, res) {
    var apiResult = {};
    try {
      var id = req.body.id || req.body.id_m_user || req.params.id;
      const showUserById = await UserModel.GetById(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: showUserById,
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
      var { username, email, password, first_name, last_name, phone, status } = req.body;
      if (!username || !email || !password) throw new Error('username, email, password wajib diisi');

      const checkUser = await UserModel.GetByEmail(email).then(({ rows }) => rows[0]);
      if (checkUser) throw new Error('Akun sudah terdaftar');

      const password_hash = await SecurityHandlers.hashPassword(password);
      const dtInsert = await UserModel.Insert({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
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
      var id = req.body.id || req.body.id_m_user || req.params.id;
      var { first_name, last_name, phone, status } = req.body;

      const getUser = await UserModel.GetById(id).then(({ rows }) => rows[0]);
      if (!getUser) throw new Error('Data tidak ditemukan');

      const dtUpdate = await UserModel.Update(
        {
          first_name,
          last_name,
          phone,
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
      var id = req.body.id || req.body.id_m_user || req.params.id;
      const delUserById = await UserModel.Delete(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: delUserById,
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

  Search: async function (req, res) {
    var apiResult = {};
    try {
      var keyword = req.query.q || req.body.q || req.body.keyword || '';
      var searchUser = await UserModel.Search(keyword).then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: searchUser,
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

  getUsers: async function (req, res) {
    return UserControllers.List(req, res);
  },
  getUserById: async function (req, res) {
    return UserControllers.Show(req, res);
  },
  createUser: async function (req, res) {
    return UserControllers.Create(req, res);
  },
  updateUser: async function (req, res) {
    return UserControllers.Update(req, res);
  },
  deleteUser: async function (req, res) {
    return UserControllers.Delete(req, res);
  },
  searchUsers: async function (req, res) {
    return UserControllers.Search(req, res);
  },
});
