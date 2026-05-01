var dbPg = require("../library/dbConnection")
var Promise = require("bluebird")

const CompanyModel = (module.exports = {
  GetList: async function () {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          mc.*
        FROM companies mc
        WHERE mc.deleted_at IS NULL
        ORDER BY mc.created_at DESC
      `
      dbPg.query(query, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  GetById: async function (id) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT *
        FROM companies
        WHERE id = $1 AND deleted_at IS NULL
      `
      dbPg.query(query, [id], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  GetByEmail: async function (email) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT *
        FROM companies
        WHERE email = $1 AND deleted_at IS NULL
      `
      dbPg.query(query, [email], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  GetByRegistrationNumber: async function (registration_number) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT *
        FROM companies
        WHERE registration_number = $1 AND deleted_at IS NULL
      `
      dbPg.query(query, [registration_number], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  Insert: async function (data) {
    return new Promise((resolve, reject) => {
      var col = []
      var val = []
      var valSql = []

      var i = 1
      for (var d in data) {
        col.push(`"` + d + `"`)
        val.push(data[d])
        valSql.push("$" + i)
        i++
      }
      var query = "INSERT INTO companies" + "(" + col.join(", ") + ") values (" + valSql.join(", ") + ") RETURNING *"
      dbPg.query(query, val, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  Update: async function (data, id) {
    return new Promise((resolve, reject) => {
      var col = []
      var val = []
      var i = 1

      for (var d in data) {
        col.push(`"` + d + `" = $` + i)
        val.push(data[d])
        i++
      }
      val.push(id)
      var query = "UPDATE companies SET " + col.join(", ") + " WHERE id = $" + i + " RETURNING *"
      dbPg.query(query, val, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  Delete: async function (id) {
    return new Promise((resolve, reject) => {
      var query = `UPDATE companies SET deleted_at = NOW() WHERE id = $1`
      dbPg.query(query, [id], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  },

  Search: async function (keyword) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT *
        FROM companies
        WHERE (name ILIKE $1 OR registration_number ILIKE $1 OR email ILIKE $1 OR city ILIKE $1)
        AND deleted_at IS NULL
        ORDER BY created_at DESC
      `
      dbPg.query(query, ["%" + keyword + "%"], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve({
            rowCount: result.rows.length,
            rows: result.rows
          })
        }
      })
    })
  }
})
