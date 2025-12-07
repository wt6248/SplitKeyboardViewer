const BASE_URL = 'http://localhost:8000';

// 관리자 로그인 및 토큰 발급
async function getAdminToken() {
  const response = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123',
    }),
  });

  if (!response.ok) {
    throw new Error(`Admin login failed: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function testAdminFilter() {
  console.log('Testing admin page 5*6 filter...\n');

  // Get admin token
  const token = await getAdminToken();
  console.log('✓ Admin token obtained\n');

  // Test filtering with 5*6 (simulating admin page request)
  console.log('Test: GET /api/keyboards?key_ranges=5*6&page=1&limit=20');
  const response = await fetch(`${BASE_URL}/api/keyboards?key_ranges=5*6&page=1&limit=20`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log(`Status: ${response.status}`);
  console.log(`Total: ${data.total} keyboards`);
  console.log(`Found: ${data.keyboards.length} keyboards on page 1`);

  if (data.keyboards.length > 0) {
    console.log('\nKeyboards:');
    data.keyboards.forEach(kb => {
      console.log(`  ✓ ID: ${kb.id}, Name: ${kb.name}, Key Count: ${kb.key_count_range}`);
    });
  } else {
    console.log('\n❌ No keyboards found! This is the bug.');
  }

  // Also test without filter to see all keyboards
  console.log('\n\nTest: GET /api/keyboards (no filter)');
  const response2 = await fetch(`${BASE_URL}/api/keyboards?page=1&limit=100`);
  const data2 = await response2.json();
  console.log(`Total keyboards: ${data2.total}`);

  const withStar = data2.keyboards.filter(kb => kb.key_count_range && kb.key_count_range.includes('*'));
  console.log(`Keyboards with * in key_count_range: ${withStar.length}`);
  withStar.forEach(kb => {
    console.log(`  - ${kb.name}: "${kb.key_count_range}"`);
  });
}

testAdminFilter().catch(console.error);
