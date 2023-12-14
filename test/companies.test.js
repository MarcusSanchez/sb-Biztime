import request from 'supertest';
import app from '../app.js';

describe('Companies API', () => {
  it('should get a list of companies', async () => {
    const response = request(app).get('/companies');
    expect(response.status).toBe(200);
    expect(response.body.companies).toBeDefined();
  });

  it('should get a specific company by code', async () => {
    const response = request(app).get('/companies/apple');
    expect(response.status).toBe(200);
    expect(response.body.company).toBeDefined();
  });

  it('should create a new company', async () => {
    const newCompany = {
      name: 'New Company',
      description: 'Description for the new company',
    };

    const response = request(app).post('/companies').send(newCompany);
    expect(response.status).toBe(201);
    expect(response.body.company).toBeDefined();
  });

  it('should update an existing company', async () => {
    const updatedCompany = {
      name: 'Updated Company Name',
      description: 'Updated description',
    };

    const response = request(app).put('/companies/apple').send(updatedCompany);
    expect(response.status).toBe(200);
    expect(response.body.company).toBeDefined();
  });

  it('should delete an existing company', async () => {
    const response = request(app).delete('/companies/apple');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('deleted');
  });
});
