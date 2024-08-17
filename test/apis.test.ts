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
