const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
  user:     process.env.DB_USERNAME || 'dev_user',
  password: process.env.DB_PASSWORD || 'adm2026+',
  host:     process.env.DB_HOST     || '10.12.140.71',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE || 'development',
  max:      parseInt(process.env.CONNECTIONLIMIT) || 10,
  connectionTimeoutMillis: parseInt(process.env.ACQRTETIMEOUT) || 30000,
};

const pool = new (require('pg')).Pool(config);
const shouldLogQuery = (process.env.DB_LOG_QUERY || 'true').toLowerCase() === 'true';

// Test connection immediately when module is loaded
pool.query('SELECT 1')
  .then(() => {
    console.warn('DATABASE CONNECTED ::', config.host, config.port, config.database);
  })
  .catch((err) => {
    console.error('DATABASE CONNECTION FAILED ::', err.message);
  });

const originalQuery = pool.query.bind(pool);

pool.query = function (text, params, callback) {
  const startedAt = Date.now();
  const sql = typeof text === 'string' ? text : text?.text || 'unknown-query';
  const sqlShort = sql.replace(/\s+/g, ' ').trim();

  // Normalize: support (text, callback) and (text, params, callback)
  if (typeof params === 'function') {
    callback = params;
    params = undefined;
  }

  const logSuccess = (result) => {
    if (shouldLogQuery) {
      console.log('[DB QUERY]', sqlShort, '| params:', JSON.stringify(params ?? []), '| rows:', result.rowCount, '| ms:', Date.now() - startedAt);
    }
  };

  const logError = (err) => {
    console.error('[DB QUERY ERROR]', sqlShort, '| message:', err.message);
  };

  // Callback style
  if (typeof callback === 'function') {
    return originalQuery(text, params, (err, result) => {
      if (err) { logError(err); }
      else { logSuccess(result); }
      callback(err, result);
    });
  }

  // Promise style
  return originalQuery(text, params)
    .then((result) => { logSuccess(result); return result; })
    .catch((err) => { logError(err); throw err; });
};

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
