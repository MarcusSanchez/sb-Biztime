import request from 'supertest';
import app from '../app.js';

describe('Invoices API', () => {
  it('should get a list of invoices', async () => {
    const response = await request(app).get('/invoices');
    expect(response.status).toBe(200);
    expect(response.body.invoices).toBeDefined();
  });

  it('should get a specific invoice by ID', async () => {
    const response = await request(app).get('/invoices/1');
    expect(response.status).toBe(200);
    expect(response.body.invoice).toBeDefined();
  });

  it('should create a new invoice', async () => {
    const newInvoice = {
      comp_code: 'apple',
      amt: 100.0,
    };

    const response = await request(app).post('/invoices').send(newInvoice);
    expect(response.status).toBe(200);
    expect(response.body.invoice).toBeDefined();
  });

  it('should update an existing invoice', async () => {
    const updatedInvoice = {
      amt: 150.0,
      paid: true,
    };

    const response = await request(app).put('/invoices/1').send(updatedInvoice);
    expect(response.status).toBe(200);
    expect(response.body.invoice).toBeDefined();
  });

  it('should delete an existing invoice', async () => {
    const response = await request(app).delete('/invoices/1');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('deleted');
  });
});
