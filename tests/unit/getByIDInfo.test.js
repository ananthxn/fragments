// tests/unit/getByidInfo.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {

  test('authenticated users get fragment metadata', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'Content-Type': 'text/plain' })
      .send('This is fragmnent');
    const id = JSON.parse(res.text).fragment.id;

    const getRes = await request(app)
      .get('/v1/fragments/' + id + '/info')
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
  });

  test('no fragments with the given id returns 404 error', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');

    const getRes = await request(app)
      .get('/v1/fragments/randomid/info')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
  });
});
