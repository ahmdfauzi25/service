const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Security Handlers
 * Handles authentication, encryption, and security operations
 */
const SecurityHandlers = {
  /**
   * Hash password
   */
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * Compare password
   */
  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },

  /**
   * Generate JWT token
   */
  generateToken: (payload, expiresIn = '24h') => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
  },

  /**
   * Verify JWT token
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return null;
    }
  },

  /**
   * Encrypt data
   */
  encrypt: (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.KEY_ENC);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  /**
   * Decrypt data
   */
  decrypt: (encrypted) => {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', process.env.KEY_ENC);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      return null;
    }
  },

  /**
   * Generate random token
   */
  generateRandomToken: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },
};

module.exports = SecurityHandlers;
