#!/usr/bin/env node

const API_URL = process.env.VITE_API_URL || 'http://localhost:4000/api';

async function smokeTest() {
  console.log('🧪 Running smoke tests...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${API_URL.replace(/\/api$/, '')}/health`,
      expected: { ok: true }
    },
    {
      name: 'API Info',
      url: `${API_URL}/`,
      expected: { name: 'Black Hat SEO API' }
    },
    {
      name: 'Jobs Endpoint',
      url: `${API_URL}/jobs`,
      expected: { success: true }
    },
    {
      name: 'Websites Endpoint', 
      url: `${API_URL}/websites`,
      expected: { success: true }
    },
    {
      name: 'Metrics Endpoint',
      url: `${API_URL}/metrics`,
      expected: null // May require auth
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${test.url}`);
      
      const response = await fetch(test.url);
      const data = await response.json();
      
      if (response.ok) {
        if (test.expected) {
          const hasExpected = Object.keys(test.expected).every(key => 
            data.hasOwnProperty(key)
          );
          if (hasExpected) {
            console.log('✅ PASS\n');
            passed++;
          } else {
            console.log('❌ FAIL - Missing expected fields');
            console.log('Expected:', test.expected);
            console.log('Got:', data);
            console.log('');
            failed++;
          }
        } else {
          console.log('✅ PASS (response received)\n');
          passed++;
        }
      } else {
        console.log(`❌ FAIL - HTTP ${response.status}`);
        console.log('Response:', data);
        console.log('');
        failed++;
      }
    } catch (error) {
      console.log(`❌ FAIL - ${error.message}\n`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check if backend is running on port 4000');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

smokeTest().catch(console.error);