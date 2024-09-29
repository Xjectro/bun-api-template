import request from 'supertest';
import app from '../src/index';

const testEndpoint = (method: 'get' | 'post', endpoint: string) => {
  const httpMethod = method.toUpperCase();
  describe(`${httpMethod} ${endpoint}`, () => {
    it('should make a request successfully', async () => {
      const response = await request(app)[method](endpoint).set('Accept', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });
  });
};

testEndpoint('get', '/api/users/me');
testEndpoint('post', '/api/users/me/update');
testEndpoint('get', '/api/users/me/connections');

testEndpoint('post', '/api/auth/login');
testEndpoint('post', '/api/auth/register');
testEndpoint('post', '/api/auth/forgot-password');
testEndpoint('post', '/api/auth/refresh-password');
testEndpoint('post', '/api/auth/code');

testEndpoint('get', '/api/token/refresh');

testEndpoint('post', '/api/users/connections/discord');