const { pool } = require('../../config/database');

class Order {
  static async create(userId, gameId, pricePaid) {
    const result = await pool.query(
      'INSERT INTO orders (user_id, game_id, price_paid) VALUES ($1, $2, $3) RETURNING *',
      [userId, gameId, pricePaid]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT o.*, g.title FROM orders o 
       JOIN games g ON o.game_id = g.id 
       WHERE o.user_id = $1 ORDER BY o.purchased_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async userOwnsGame(userId, gameId) {
    const result = await pool.query(
      'SELECT id FROM orders WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );
    return result.rows.length > 0;
  }
}

class Wishlist {
  static async add(userId, gameId) {
    const result = await pool.query(
      'INSERT INTO wishlists (user_id, game_id) VALUES ($1, $2) RETURNING *',
      [userId, gameId]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT w.*, g.title, g.price FROM wishlists w 
       JOIN games g ON w.game_id = g.id 
       WHERE w.user_id = $1 ORDER BY w.added_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async remove(userId, gameId) {
    const result = await pool.query(
      'DELETE FROM wishlists WHERE user_id = $1 AND game_id = $2 RETURNING id',
      [userId, gameId]
    );
    return result.rows[0];
  }
}

module.exports = { Order, Wishlist };