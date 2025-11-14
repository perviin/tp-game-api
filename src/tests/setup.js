const { pool } = require('../config/database');
const mongoose = require('mongoose');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gamevault_test');
  }
});

afterAll(async () => {
  await pool.end();
  await mongoose.connection.close();
});

module.exports = {};