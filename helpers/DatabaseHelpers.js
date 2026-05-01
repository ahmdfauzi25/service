/**
 * Database Helper
 * Common database operations
 */
const DatabaseHelpers = {
  /**
   * Get paginated results
   */
  getPaginated: async (db, query, countQuery, params, page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.rows[0].count);

      // Get paginated data
      const dataQuery = query + ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      const dataParams = [...params, limit, offset];

      const dataResult = await db.query(dataQuery, dataParams);

      return {
        data: dataResult.rows,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Pagination error:', error);
      return { data: [], pagination: {} };
    }
  },

  /**
   * Get by ID
   */
  getById: async (db, table, id) => {
    try {
      const query = `SELECT * FROM ${table} WHERE id = $1`;
      const result = await db.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Get ${table} by ID error:`, error);
      return null;
    }
  },

  /**
   * Create record
   */
  create: async (db, table, data) => {
    try {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const query = `
        INSERT INTO ${table} (${columns})
        VALUES (${placeholders})
        RETURNING *
      `;

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error(`Create ${table} error:`, error);
      return null;
    }
  },

  /**
   * Update record
   */
  update: async (db, table, id, data) => {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

      const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE id = $${columns.length + 1}
        RETURNING *
      `;

      const result = await db.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error(`Update ${table} error:`, error);
      return null;
    }
  },

  /**
   * Delete record
   */
  delete: async (db, table, id) => {
    try {
      const query = `DELETE FROM ${table} WHERE id = $1`;
      await db.query(query, [id]);
      return true;
    } catch (error) {
      console.error(`Delete ${table} error:`, error);
      return false;
    }
  },
};

module.exports = DatabaseHelpers;
