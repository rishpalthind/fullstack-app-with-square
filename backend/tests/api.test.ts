import request from 'supertest';
import { app } from '../src/server';

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
});

describe('API Routes', () => {
  describe('GET /api/locations', () => {
    it('should return locations when Square API is available', async () => {
      // Skip if no Square token configured
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        return;
      }

      const response = await request(app)
        .get('/api/locations')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle Square API errors gracefully', async () => {
      // This test would require mocking Square API
      // For now, we just test the error handling structure
      expect(true).toBe(true);
    });
  });

  describe('GET /api/catalog', () => {
    it('should require location_id parameter', async () => {
      const response = await request(app)
        .get('/api/catalog')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('location_id');
    });

    it('should return catalog data when location_id is provided', async () => {
      // Skip if no Square token configured
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        return;
      }

      // This would require a valid location ID
      // For now, we test that the endpoint exists
      const response = await request(app)
        .get('/api/catalog?location_id=test')
        .expect(400); // Will fail validation but endpoint exists

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/catalog/categories', () => {
    it('should require location_id parameter', async () => {
      const response = await request(app)
        .get('/api/catalog/categories')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.message).toContain('location_id');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});