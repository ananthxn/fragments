const request = require('supertest');
const app = require('../../src/app');

// describe('404 Handler', () =>

// );

describe('404 handler', () => {
  test('should return 404 for routes that dont exist', async () => {
    const res = await request(app).get('/bad-route');
    expect(res.statusCode).toBe(404);
  });
});
