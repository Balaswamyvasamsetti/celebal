const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API...');
    
    // Test root endpoint
    const rootResponse = await axios.get('http://localhost:5000/');
    console.log('Root endpoint:', rootResponse.data);
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Health endpoint:', healthResponse.data);
    
    console.log('API is working correctly!');
  } catch (error) {
    console.error('API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();