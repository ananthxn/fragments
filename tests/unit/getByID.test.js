const request = require('supertest');
const app = require('../../src/app');


describe('GET /v1/fragments/:id', () => {
  
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/14567').expect(401));

 
  test('authenticated users get fragment data with the given id', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toEqual('This is fragment');
  });

  test('no fragments with the given id returns 404 error', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/wrongid')
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(404);
  });

});


