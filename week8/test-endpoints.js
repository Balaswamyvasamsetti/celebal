const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAllEndpoints() {
  console.log('Testing API endpoints...\n');

  // Test health
  try {
    const health = await testEndpoint('/api/health');
    console.log('✅ Health check:', health.status, health.data);
  } catch (err) {
    console.log('❌ Health check failed:', err.message);
  }

  // Test register
  try {
    const register = await testEndpoint('/api/auth/register', 'POST', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('✅ Register:', register.status, register.data);
  } catch (err) {
    console.log('❌ Register failed:', err.message);
  }

  // Test login
  try {
    const login = await testEndpoint('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login:', login.status, login.data);
  } catch (err) {
    console.log('❌ Login failed:', err.message);
  }
}

testAllEndpoints();