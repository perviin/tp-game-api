const jwt = require('jsonwebtoken');
const User = require('../models/postgres/User');
const { pool } = require('../config/database');
const ActivityLog = require('../models/mongo/ActivityLog');

class AuthService {
  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }

  async register(email, password, username) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) throw new Error('USER_EXISTS');

    const user = await User.create(email, password, username);

    await ActivityLog.create({
      userId: user.id,
      action: 'REGISTER',
      details: { email, username }
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) throw new Error('INVALID_CREDENTIALS');

    await ActivityLog.create({
      userId: user.id,
      action: 'LOGIN',
      details: { email }
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const result = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
        [refreshToken, decoded.id]
      );

      if (result.rows.length === 0) throw new Error('TOKEN_INVALID');

      const user = await User.findById(decoded.id);
      if (!user) throw new Error('USER_NOT_FOUND');

      const newAccessToken = this.generateAccessToken(user);
      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error('TOKEN_INVALID');
    }
  }

  async storeRefreshToken(userId, token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
  }

  async logout(refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }
}

module.exports = new AuthService();