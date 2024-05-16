// contact.test.js
const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary to import your Express app

describe('/contact route', () => {
  it('should save contact form data', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    const response = await request(app)
      .post('/contact')
      .send(contactData);

    expect(response.statusCode).toBe(200);
    // Add more assertions as needed
  });

  // Add more tests for different scenarios (e.g., validation errors, server errors)
});

