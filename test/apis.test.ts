import request from 'supertest';
import app from '../src/index';

describe('GET /api/users/me', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/users/me/update', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/users/me/update')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/users/me/connections', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .get('/api/users/me/connections')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/auth/login', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/auth/register', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/auth/forgot-password', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/auth/refresh-password', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/auth/refresh-password')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/auth/code', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/auth/code')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/token/refresh', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .get('/api/token/refresh')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});

describe('GET /api/connections/twitter', () => {
  it('should make a request successfully', async () => {
    const response = await request(app)
      .post('/api/connections/twitter')
      .set('Accept', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });
});
