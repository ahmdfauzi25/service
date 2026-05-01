// API Configuration
module.exports = {
  API_URL: process.env.API_URL || 'svc/',
  API_VERSION: process.env.VERSION || 'v1',
  PORT: process.env.PORT || 3010,
  ENV: process.env.ENV || 'development',
  KEY_ENC: process.env.KEY_ENC,
  SECRET_KEY: process.env.SECRET_KEY,
  ACQUISITION_TIMEOUT: process.env.ACQRTETIMEOUT || 30000,
};
