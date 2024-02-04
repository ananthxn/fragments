const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  const plainTextData = 'plain text fragment';
  const unsupportedTypeData = Buffer.from('This data type is not supported');

  // Unauthenticated requests are denied
  test('unauthenticated are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(plainTextData);
    expect(res.statusCode).toBe(401);
  });

  // Incorrect credentials are denied
  test('invalid login credentials', async () => {
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


  // Using a valid username/password pair should give a success result with a .fragments array
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

  test('authenticated users create a plain text fragment with correct expected properties ', async () => {
    const data = Buffer.from('test fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    expect(res.statusCode).toBe(201);
    const fragment = JSON.parse(res.text);
    expect(fragment).toHaveProperty('id');
    expect(fragment).toHaveProperty('ownerId');
    expect(fragment).toHaveProperty('created');
    expect(fragment).toHaveProperty('updated');
    expect(fragment).toHaveProperty('type', 'text/plain');
    expect(fragment).toHaveProperty('size', data.length);
    expect(Date.parse(fragment.created)).not.toBeNaN();
    expect(Date.parse(fragment.updated)).not.toBeNaN();
  });


  // POST response includes a Location header with a full URL to GET the created fragment
  test('response includes a Location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(plainTextData);
    expect(res.headers).toHaveProperty('location');
    expect(res.headers.location).toEqual(expect.stringContaining(`/v1/fragments/${JSON.parse(res.text).id}`));
  });

  // Incorrect content types are denied
  test('incorrect types are denied with 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'wrong/type')
      .send(unsupportedTypeData);
    expect(res.statusCode).toBe(415);
  });

});
