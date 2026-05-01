var dbPg = require("../library/dbConnection")
var Promise = require("bluebird")

const AuditTrailModel = (module.exports = {
  List: async function () {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          at.id,
          at.user_id,
          at.action,
          at.module,
          at.description,
          at.old_values,
          at.new_values,
          at.ip_address,
          at.user_agent,
          at.created_at,
          u.username,
          u.email,
          u.first_name,
          u.last_name
        FROM audit_trails at
        LEFT JOIN users u ON at.user_id = u.id
        ORDER BY at.created_at DESC
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
        SELECT
          at.*,
          u.username,
          u.email,
          u.first_name,
          u.last_name
        FROM audit_trails at
        LEFT JOIN users u ON at.user_id = u.id
        WHERE at.id = $1
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

  GetByUserId: async function (user_id) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          at.*,
          u.username,
          u.email
        FROM audit_trails at
        LEFT JOIN users u ON at.user_id = u.id
        WHERE at.user_id = $1
        ORDER BY at.created_at DESC
      `
      dbPg.query(query, [user_id], function (err, result) {
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

  GetByModule: async function (module) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          at.*,
          u.username,
          u.email
        FROM audit_trails at
        LEFT JOIN users u ON at.user_id = u.id
        WHERE at.module = $1
        ORDER BY at.created_at DESC
      `
      dbPg.query(query, [module], function (err, result) {
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

  GetByAction: async function (action) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          at.*,
          u.username,
          u.email
        FROM audit_trails at
        LEFT JOIN users u ON at.user_id = u.id
        WHERE at.action = $1
        ORDER BY at.created_at DESC
      `
      dbPg.query(query, [action], function (err, result) {
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
      var query = "INSERT INTO audit_trails" + "(" + col.join(", ") + ") values (" + valSql.join(", ") + ") RETURNING *"
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
      var query = `DELETE FROM audit_trails WHERE id = $1`
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
  }
})
