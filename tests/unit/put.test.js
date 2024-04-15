// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  const plainTextData = 'plain text fragment';
  
  test('unauthenticated are denied', async () => {
    const res = await request(app)
      .put('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(plainTextData);
    expect(res.statusCode).toBe(401);
  });

  test('authenticated user successfully update a fragment data', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .send('this is fragment')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;
    console.log("id is " + id);

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('this is updated fragment')
      .set('Content-type', 'text/plain');
    expect(putRes.statusCode).toBe(201);

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('this is updated fragment');
  });

  test('put with non-existent fragment ID should return 404 status', async () => {
    const res = await request(app)
      .put('/v1/fragments/invalidId')
      .auth('user1@email.com', 'password1')
      .send('this is updated fragment')
      .set('Content-type', 'text/plain');
    expect(res.status).toBe(404);
  });

});
