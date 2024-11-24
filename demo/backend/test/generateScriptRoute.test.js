const request = require('supertest');
const app = require('../server');  // Import the exported app

jest.setTimeout(30000);

describe('Generate Script Route', () => {
  // Test case: Generate script from book title and author
  it('should generate script text from book title and author', async () => {
    const response = await request(app)
      .post('/generate_script')
      .send({
        text: 'Essentialism: The Disciplined Pursuit of Less',
        author: 'Greg McKeown'
      })
      .timeout(10000)  // Increase timeout
      .expect(200);  // Expect successful response

    // Verify response headers
    expect(response.headers['content-type']).toMatch(/application\/json/);
    
    // Verify response body contains script
    expect(response.body).toBeTruthy();
    expect(response.body).toHaveProperty('scriptText');
  });

  // Test error scenario: Missing required parameters
  it('should return 400 if book title or author is missing', async () => {
    const response = await request(app)
      .post('/generate_script')
      .send({})
      .expect(400);
  });
});
