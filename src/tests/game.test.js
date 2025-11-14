const request = require('supertest');
const app = require('../app');

describe('Game Endpoints', () => {
  describe('GET /api/games', () => {
    it('devrait lister les jeux', async () => {
      const res = await request(app).get('/api/games');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});