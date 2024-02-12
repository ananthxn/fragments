const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  const plainTextData = 'plain text fragment';
  const unsupportedTypeData = Buffer.from('This data type is not supported');

  test('unauthenticated are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(plainTextData);
    expect(res.statusCode).toBe(401);
  });

  test('invalid login credentials is denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('wrong@email.com', 'wrongpass')
      .set('Content-Type', 'text/plain')
      .send(plainTextData);
    expect(res.statusCode).toBe(401);
  });

  test('authenticated requests is accepted', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });


  test('authenticated users create a plain text fragment', async () => {
    const data = Buffer.from('test fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain'));
    expect(JSON.parse(res.text).status).toBe('ok');
  });

  test('response include a Location header with a URL to GET the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(`http://${res.request.host}/v1/fragments/${JSON.parse(res.text).fragment.id}`);
  });
  
  test('incorrect types are denied with 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'wrong/type')
      .send(unsupportedTypeData);
    expect(res.statusCode).toBe(415);
  });

});
