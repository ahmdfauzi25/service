/**
 * Audit Trail Helper
 * Logs user actions for audit purposes
 */
const AuditTrailHelpers = {
  /**
   * Log audit trail
   */
  logAuditTrail: async (db, {
    userId,
    action,
    module,
    description,
    oldValues,
    newValues,
    ipAddress,
    userAgent,
  }) => {
    try {
      const query = `
        INSERT INTO audit_trails 
        (user_id, action, module, description, old_values, new_values, ip_address, user_agent, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `;

      await db.query(query, [
        userId,
        action,
        module,
        description,
        JSON.stringify(oldValues),
        JSON.stringify(newValues),
        ipAddress,
        userAgent,
      ]);

      return true;
    } catch (error) {
      console.error('Audit trail error:', error);
      return false;
    }
  },

  /**
   * Get audit trails
   */
  getAuditTrails: async (db, { userId = null, module = null, limit = 100, offset = 0 }) => {
    try {
      let query = 'SELECT * FROM audit_trails WHERE 1=1';
      const params = [];

      if (userId) {
        params.push(userId);
        query += ` AND user_id = $${params.length}`;
      }

      if (module) {
        params.push(module);
        query += ` AND module = $${params.length}`;
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Get audit trails error:', error);
      return [];
    }
  },
};

module.exports = AuditTrailHelpers;
