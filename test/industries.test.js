import request from 'supertest';
import app from '../app.js';

describe('Industries API', () => {
  it('should get a list of industries', async () => {
    const response = await request(app).get('/industries');
    expect(response.status).toBe(200);
    expect(response.body.industries).toBeDefined();
  });

  it('should get a specific industry by code', async () => {
    const response = await request(app).get('/industries/tech');
    expect(response.status).toBe(200);
    expect(response.body.industry).toBeDefined();
  });

  it('should create a new industry', async () => {
    const newIndustry = {
      code: 'NewIndustry',
      industry: 'New Industry',
    };

    const response = await request(app).post('/industries').send(newIndustry);
    expect(response.status).toBe(201);
    expect(response.body.industry).toBeDefined();
  });

  it('should associate a company with an industry', async () => {
    const associationData = {
      comp_code: 'apple',
    };

    const response = await request(app).post('/industries/tech').send(associationData);
    expect(response.status).toBe(201);
    expect(response.body.company_industry).toBeDefined();
  });

  it('should delete an existing industry', async () => {
    const response = await request(app).delete('/industries/tech');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('deleted');
  });
});
