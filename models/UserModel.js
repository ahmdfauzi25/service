var dbPg = require("../library/dbConnection")
var Promise = require("bluebird")

const UserModel = (module.exports = {
  List: async function () {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          id,
          username,
          email,
          first_name,
          last_name,
          phone,
          status,
          created_at,
          updated_at
        FROM users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
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
        FROM users
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
        FROM users
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

  GetByUsername: async function (username) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT *
        FROM users
        WHERE username = $1 AND deleted_at IS NULL
      `
      dbPg.query(query, [username], function (err, result) {
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
      var query = "INSERT INTO users" + "(" + col.join(", ") + ") values (" + valSql.join(", ") + ") RETURNING *"
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
      var query = "UPDATE users SET " + col.join(", ") + " WHERE id = $" + i + " RETURNING *"
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
      var query = `UPDATE users SET deleted_at = NOW() WHERE id = $1`
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
        FROM users
        WHERE (username ILIKE $1 OR email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1)
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
