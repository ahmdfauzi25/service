var dbPg = require("../library/dbConnection")
var Promise = require("bluebird")

const EmployeeModel = (module.exports = {
  List: async function () {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          me.id,
          me.user_id,
          me.employee_id,
          me.department,
          me.position,
          me.manager_id,
          me.hire_date,
          me.status,
          me.created_at,
          me.updated_at,
          u.username,
          u.first_name,
          u.last_name,
          u.email
        FROM employees me
        LEFT JOIN users u ON u.id = me.user_id
        WHERE me.deleted_at IS NULL
        ORDER BY me.created_at DESC
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
          me.*,
          u.username,
          u.first_name,
          u.last_name,
          u.email,
          u.phone
        FROM employees me
        LEFT JOIN users u ON u.id = me.user_id
        WHERE me.id = $1 AND me.deleted_at IS NULL
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

  GetByEmployeeId: async function (employee_id) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          me.*,
          u.username,
          u.first_name,
          u.last_name,
          u.email
        FROM employees me
        LEFT JOIN users u ON u.id = me.user_id
        WHERE me.employee_id = $1 AND me.deleted_at IS NULL
      `
      dbPg.query(query, [employee_id], function (err, result) {
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

  GetByDepartment: async function (department) {
    return new Promise((resolve, reject) => {
      var query = `
        SELECT
          me.*,
          u.username,
          u.first_name,
          u.last_name,
          u.email
        FROM employees me
        LEFT JOIN users u ON u.id = me.user_id
        WHERE me.department = $1 AND me.deleted_at IS NULL
        ORDER BY u.last_name, u.first_name
      `
      dbPg.query(query, [department], function (err, result) {
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
      var query = "INSERT INTO employees" + "(" + col.join(", ") + ") values (" + valSql.join(", ") + ") RETURNING *"
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
      var query = "UPDATE employees SET " + col.join(", ") + " WHERE id = $" + i + " RETURNING *"
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
      var query = `UPDATE employees SET deleted_at = NOW() WHERE id = $1`
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
        SELECT
          me.*,
          u.username,
          u.first_name,
          u.last_name,
          u.email
        FROM employees me
        LEFT JOIN users u ON u.id = me.user_id
        WHERE (me.employee_id ILIKE $1 OR me.position ILIKE $1 OR me.department ILIKE $1
               OR u.first_name ILIKE $1 OR u.last_name ILIKE $1)
        AND me.deleted_at IS NULL
        ORDER BY me.created_at DESC
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
