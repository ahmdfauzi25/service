// Database configuration
const config = {
  development: {
    dialect: 'pg',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionLimit: parseInt(process.env.CONNECTIONLIMIT) || 10,
  },
  production: {
    dialect: 'pg',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionLimit: parseInt(process.env.CONNECTIONLIMIT) || 20,
  },
};

module.exports = config[process.env.ENV || 'development'];
