/**
 * Test script for Calculator Backend API
 * Run with: node test-api.js
 */

const http = require('http');

// Configuration
const HOST = 'localhost';
const PORT = 8080;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/calculate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testCalculation(num1, num2, operation, expectedResult) {
  const testName = `${num1} ${operation} ${num2}`;
  
  try {
    log(colors.cyan, `\n🧪 Testing: ${testName}`);
    
    const { statusCode, data } = await makeRequest({
      num1: num1,
      num2: num2,
      operation: operation
    });

    if (data.success) {
      const passed = Math.abs(data.result - expectedResult) < 0.0001;
      
      if (passed) {
        log(colors.green, `✅ PASSED: ${data.calculation} = ${data.result}`);
      } else {
        log(colors.red, `❌ FAILED: Expected ${expectedResult}, got ${data.result}`);
      }
      
      return passed;
    } else {
      log(colors.red, `❌ ERROR: ${data.error}`);
      return false;
    }
  } catch (error) {
    log(colors.red, `❌ REQUEST FAILED: ${error.message}`);
    return false;
  }
}

async function testHealthCheck() {
  return new Promise((resolve, reject) => {
    log(colors.cyan, '\n🏥 Testing Health Check...');
    
    http.get(`http://${HOST}:${PORT}/api/health`, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.status === 'healthy') {
            log(colors.green, `✅ Server is healthy`);
            log(colors.blue, `   Service: ${response.service}`);
            resolve(true);
          } else {
            log(colors.red, '❌ Server is not healthy');
            resolve(false);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function runTests() {
  log(colors.blue, '╔════════════════════════════════════════╗');
  log(colors.blue, '║  Calculator Backend API Test Suite    ║');
  log(colors.blue, '╚════════════════════════════════════════╝');

  const results = [];

  try {
    // Health check
    const healthCheck = await testHealthCheck();
    results.push(healthCheck);

    // Addition tests
    results.push(await testCalculation(10, 5, 'add', 15));
    results.push(await testCalculation(100, 200, 'add', 300));
    results.push(await testCalculation(-5, 10, 'add', 5));

    // Subtraction tests
    results.push(await testCalculation(20, 8, 'subtract', 12));
    results.push(await testCalculation(5, 10, 'subtract', -5));

    // Multiplication tests
    results.push(await testCalculation(7, 8, 'multiply', 56));
    results.push(await testCalculation(12, 0, 'multiply', 0));

    // Division tests
    results.push(await testCalculation(100, 5, 'divide', 20));
    results.push(await testCalculation(7, 2, 'divide', 3.5));

    // Power tests
    results.push(await testCalculation(2, 10, 'power', 1024));
    results.push(await testCalculation(5, 3, 'power', 125));

    // Modulo tests
    results.push(await testCalculation(17, 5, 'modulo', 2));
    results.push(await testCalculation(100, 7, 'modulo', 2));

    // Summary
    const passed = results.filter(r => r).length;
    const total = results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    log(colors.blue, '\n╔════════════════════════════════════════╗');
    log(colors.blue, '║           Test Summary                 ║');
    log(colors.blue, '╚════════════════════════════════════════╝');
    log(colors.yellow, `Total Tests: ${total}`);
    log(colors.green, `Passed: ${passed}`);
    log(colors.red, `Failed: ${total - passed}`);
    log(colors.cyan, `Success Rate: ${percentage}%`);

    if (passed === total) {
      log(colors.green, '\n🎉 All tests passed! ✨');
    } else {
      log(colors.red, '\n⚠️  Some tests failed. Please review.');
    }

  } catch (error) {
    log(colors.red, `\n❌ Test suite failed: ${error.message}`);
    log(colors.yellow, 'Make sure the server is running on http://localhost:8080');
  }
}

// Run the tests
runTests();
