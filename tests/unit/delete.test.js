// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('DELETE /v1/fragments', () => {

  test('deleted fragment successfully', async () => {
    const postRes = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send("this is a fragment")
      .set('Content-type', 'text/plain');

    const id = JSON.parse(postRes.text).fragment.id;

    const res = await request(app)
      .delete('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('error while trying to delete non-existant fragment', async () => {

    const res = await request(app)
      .delete('/v1/fragments/12345')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
  });
});
