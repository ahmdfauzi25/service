/**
 * Response Generator Helper
 * Standardized API response format
 */
const ResponseGenerator = {
  /**
   * Success response
   */
  success: (data = null, message = 'Success', statusCode = 200) => {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date(),
    };
  },

  /**
   * Error response
   */
  error: (message = 'Error', statusCode = 500, details = null) => {
    return {
      success: false,
      statusCode,
      message,
      details,
      timestamp: new Date(),
    };
  },

  /**
   * Paginated response
   */
  paginated: (data = [], total = 0, page = 1, limit = 10, message = 'Success') => {
    return {
      success: true,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date(),
    };
  },
};

module.exports = ResponseGenerator;
