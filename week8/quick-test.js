const http = require('http');

// Test if backend server is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Backend server is running!');
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.log('❌ Backend server is not running or not accessible');
  console.log('Error:', err.message);
  console.log('\nTo start the backend server:');
  console.log('cd backend && npm start');
});

req.end();