const { pool } = require('../../config/database');

class Review {
  static async create(userId, gameId, rating, comment) {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, game_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, gameId, rating, comment]
    );
    return result.rows[0];
  }

  static async findByGameId(gameId) {
    const result = await pool.query(
      `SELECT r.*, u.username FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.game_id = $1 ORDER BY r.created_at DESC`,
      [gameId]
    );
    const avgResult = await pool.query(
      'SELECT AVG(rating)::numeric(10,1) as average FROM reviews WHERE game_id = $1',
      [gameId]
    );
    return {
      reviews: result.rows,
      average: parseFloat(avgResult.rows[0].average) || 0
    };
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async existsForUser(userId, gameId) {
    const result = await pool.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );
    return result.rows.length > 0;
  }
}

module.exports = Review;