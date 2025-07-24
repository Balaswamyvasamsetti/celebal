const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testApi() {
  try {
    console.log('Testing API health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('Health check response:', healthResponse.data);
    
    console.log('\nTesting registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, registerData);
    console.log('Registration response:', registerResponse.data);
    
    const token = registerResponse.data.token;
    
    console.log('\nTesting authentication with token...');
    const authResponse = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Authentication response:', authResponse.data);
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('API Test Error:', error.response?.data || error.message);
  }
}

testApi();