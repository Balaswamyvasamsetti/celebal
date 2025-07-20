const axios = require('axios');

async function testWeek6Compatibility() {
  try {
    console.log('Testing Week6 Compatibility Endpoints...');
    
    // Test users endpoint
    console.log('\nTesting /users endpoint:');
    const usersResponse = await axios.get('http://localhost:5000/users');
    console.log('GET /users:', usersResponse.data.length, 'users found');
    
    // Test products endpoint
    console.log('\nTesting /products endpoint:');
    const productsResponse = await axios.get('http://localhost:5000/products');
    console.log('GET /products:', productsResponse.data.length, 'products found');
    
    // Test orders endpoint
    console.log('\nTesting /orders endpoint:');
    const ordersResponse = await axios.get('http://localhost:5000/orders');
    console.log('GET /orders:', ordersResponse.data.length, 'orders found');
    
    console.log('\nWeek6 compatibility endpoints are working correctly!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWeek6Compatibility();