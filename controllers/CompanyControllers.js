const CompanyModel = require('../models/CompanyModel');

const CompanyControllers = (module.exports = {
  List: async function (req, res) {
    var apiResult = {};
    try {
      let getCompany = await CompanyModel.GetList().then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getCompany,
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
      var id = req.body.id || req.body.id_m_companies || req.params.id;
      const getDetail = await CompanyModel.GetById(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: getDetail,
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
      var { name, registration_number, email, phone, website, address, city, country, status } = req.body;

      if (email) {
        let checkCompany = await CompanyModel.GetByEmail(email).then(({ rows }) => rows[0]);
        if (checkCompany) throw 'Perusahaan sudah terdaftar';
      }

      const dtInsert = await CompanyModel.Insert({
        name,
        registration_number,
        email,
        phone,
        website,
        address,
        city,
        country,
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
      var id = req.body.id || req.body.id_m_companies || req.params.id;
      var { name, email, phone, website, address, city, country, status } = req.body;

      const getCompany = await CompanyModel.GetById(id).then(({ rows }) => rows[0]);
      if (!getCompany) throw 'Data tidak ditemukan';

      const dtUpdate = await CompanyModel.Update(
        {
          name,
          email,
          phone,
          website,
          address,
          city,
          country,
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
      var id = req.body.id || req.body.id_m_companies || req.params.id;
      const deleteCompanyById = await CompanyModel.Delete(id).then(({ rows }) => rows[0]);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: deleteCompanyById,
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
      var searchCompany = await CompanyModel.Search(keyword).then(({ rows }) => rows);
      apiResult = {
        success: true,
        message: 'Operation Success',
        data: searchCompany,
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

  getCompanies: async function (req, res) {
    return CompanyControllers.List(req, res);
  },
  getCompanyById: async function (req, res) {
    return CompanyControllers.Detail(req, res);
  },
  createCompany: async function (req, res) {
    return CompanyControllers.Create(req, res);
  },
  updateCompany: async function (req, res) {
    return CompanyControllers.Update(req, res);
  },
  deleteCompany: async function (req, res) {
    return CompanyControllers.Delete(req, res);
  },
  searchCompanies: async function (req, res) {
    return CompanyControllers.Search(req, res);
  },
});
