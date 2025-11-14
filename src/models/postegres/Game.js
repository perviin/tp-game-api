const { pool } = require('../../config/database');

class Game {
  static async create(gameData) {
    const { title, description, price, publisher, releaseDate } = gameData;
    const result = await pool.query(
      'INSERT INTO games (title, description, price, publisher, release_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, price, publisher, releaseDate]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findAll(limit = 20, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM games ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await pool.query('SELECT COUNT(*) FROM games');
    return {
      games: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let index = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${index}`);
        values.push(updates[key]);
        index++;
      }
    });

    values.push(id);
    const result = await pool.query(
      `UPDATE games SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Game;