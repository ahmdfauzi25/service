const UserModel = require('../models/UserModel');
const SecurityHandlers = require('../helpers/SecurityHandlers');

const AuthControllers = (module.exports = {
  Login: async function (req, res) {
    var apiResult = {};
    try {
      var { email, password } = req.body;
      if (!email || !password) throw 'Email dan password wajib diisi';

      const user = await UserModel.GetByEmail(email).then(({ rows }) => rows[0]);
      if (!user) throw 'Akun tidak ditemukan';

      const isValidPassword = await SecurityHandlers.comparePassword(password, user.password_hash);
      if (!isValidPassword) throw 'Password salah';

      const token = SecurityHandlers.generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      apiResult = {
        success: true,
        message: 'Operation Success',
        data: {
          user,
          token,
        },
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    res.status(200).json(apiResult);
  },

  Create: async function (req, res) {
    var apiResult = {};
    try {
      var { username, email, password, first_name, last_name, phone, status } = req.body;
      if (!username || !email || !password) throw 'Username, email, dan password wajib diisi';

      const checkUser = await UserModel.GetByEmail(email).then(({ rows }) => rows[0]);
      if (checkUser) throw 'Akun sudah terdaftar';

      const password_hash = await SecurityHandlers.hashPassword(password);

      let dtInsert = await UserModel.Insert({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        status: status || 'active',
      });

      apiResult = {
        success: true,
        message: 'Operation Success',
        data: dtInsert.rows[0],
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    res.status(200).json(apiResult);
  },

  Profile: async function (req, res) {
    var apiResult = {};
    try {
      var { id } = req.user || {};
      if (!id) throw 'Unauthorized';

      const getProfile = await UserModel.GetById(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getProfile,
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    res.status(200).json(apiResult);
  },

  Logout: async function (req, res) {
    var apiResult = {};
    try {
      apiResult = {
        success: true,
        message: 'Operation Success',
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
      var { id, password } = req.body;
      if (!id || !password) throw 'id dan password wajib diisi';

      const getUser = await UserModel.GetById(id).then(({ rows }) => rows[0]);
      if (!getUser) throw 'Data tidak ditemukan';

      const password_hash = await SecurityHandlers.hashPassword(password);
      const dtUpdate = await UserModel.Update({ password_hash }, id).then(({ rows }) => rows[0]);

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

  login: async function (req, res) {
    return AuthControllers.Login(req, res);
  },
  register: async function (req, res) {
    return AuthControllers.Create(req, res);
  },
  refreshToken: async function (req, res) {
    var apiResult = {};
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) throw 'No token provided';

      const decoded = SecurityHandlers.verifyToken(token);
      if (!decoded) throw 'Invalid token';

      const newToken = SecurityHandlers.generateToken(decoded);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: { token: newToken },
      };
    } catch (error) {
      apiResult = {
        success: false,
        message: error.toString(),
      };
    }
    return res.status(200).json(apiResult);
  },
  logout: async function (req, res) {
    return AuthControllers.Logout(req, res);
  },
});
