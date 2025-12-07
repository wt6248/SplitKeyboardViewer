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

// 테스트 1: Pagination - 20개 이상 키보드 조회
async function testPagination() {
  console.log('\n=== Test 1: Pagination (20개 이상 조회) ===');

  const response = await fetch(`${BASE_URL}/api/keyboards?page=1&limit=20`);

  if (!response.ok) {
    throw new Error(`Failed to fetch keyboards: ${response.status}`);
  }

  const data = await response.json();

  console.log(`✓ Page 1: ${data.keyboards.length}개 키보드`);
  console.log(`✓ Total: ${data.total}개`);
  console.log(`✓ Total Pages: ${data.total_pages}`);

  // Page 2도 조회 가능한지 확인
  if (data.total_pages > 1) {
    const page2Response = await fetch(`${BASE_URL}/api/keyboards?page=2&limit=20`);
    const page2Data = await page2Response.json();
    console.log(`✓ Page 2: ${page2Data.keyboards.length}개 키보드`);
  }

  return true;
}

// 테스트 2: 이름 검색 필터
async function testNameFilter() {
  console.log('\n=== Test 2: 이름 검색 필터 ===');

  const response = await fetch(`${BASE_URL}/api/keyboards?search=moonlander`);

  if (!response.ok) {
    throw new Error(`Failed to search keyboards: ${response.status}`);
  }

  const data = await response.json();

  console.log(`✓ 검색 결과: ${data.keyboards.length}개`);

  if (data.keyboards.length > 0) {
    data.keyboards.forEach(kb => {
      console.log(`  - ${kb.name}`);
      if (!kb.name.toLowerCase().includes('moonlander')) {
        console.warn(`    ⚠ Warning: "${kb.name}" doesn't contain "moonlander"`);
      }
    });
  }

  return true;
}

// 테스트 3: 키배열(keyboard_type) 필터
async function testKeyboardTypeFilter() {
  console.log('\n=== Test 3: 키배열(keyboard_type) 필터 ===');

  const types = ['ortholinear', 'column_stagger', 'splay', 'alice', 'dactyl'];

  for (const type of types) {
    const response = await fetch(`${BASE_URL}/api/keyboards?keyboard_type=${type}`);

    if (!response.ok) {
      throw new Error(`Failed to filter by keyboard_type=${type}: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✓ ${type}: ${data.keyboards.length}개`);

    // 결과 검증
    data.keyboards.forEach(kb => {
      if (kb.keyboard_type !== type) {
        throw new Error(`Expected keyboard_type=${type}, got ${kb.keyboard_type} for ${kb.name}`);
      }
    });
  }

  return true;
}

// 테스트 4: 키 개수 필터
async function testKeyRangeFilter() {
  console.log('\n=== Test 4: 키 개수 필터 ===');

  const ranges = ['3*5', '3*6', '4*5', '4*6', '5*6', '40', '42', 'tkl'];

  for (const range of ranges) {
    const response = await fetch(`${BASE_URL}/api/keyboards?key_ranges=${range}`);

    if (!response.ok) {
      throw new Error(`Failed to filter by key_ranges=${range}: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✓ ${range}: ${data.keyboards.length}개`);

    // 결과 검증
    data.keyboards.forEach(kb => {
      if (kb.key_count_range !== range) {
        throw new Error(`Expected key_count_range=${range}, got ${kb.key_count_range} for ${kb.name}`);
      }
    });
  }

  return true;
}

// 테스트 5: 복합 필터 (이름 + 키배열 + 키 개수)
async function testCombinedFilters() {
  console.log('\n=== Test 5: 복합 필터 ===');

  const response = await fetch(`${BASE_URL}/api/keyboards?keyboard_type=ortholinear&key_ranges=5*6&search=`);

  if (!response.ok) {
    throw new Error(`Failed to apply combined filters: ${response.status}`);
  }

  const data = await response.json();

  console.log(`✓ ortholinear + 5*6: ${data.keyboards.length}개`);

  // 결과 검증
  data.keyboards.forEach(kb => {
    if (kb.keyboard_type !== 'ortholinear') {
      throw new Error(`Expected keyboard_type=ortholinear, got ${kb.keyboard_type}`);
    }
    if (kb.key_count_range !== '5*6') {
      throw new Error(`Expected key_count_range=5*6, got ${kb.key_count_range}`);
    }
    console.log(`  - ${kb.name} (${kb.keyboard_type}, ${kb.key_count_range})`);
  });

  return true;
}

// 모든 테스트 실행
async function runAllTests() {
  console.log('====================================');
  console.log('Admin Page Filters & Pagination Test');
  console.log('====================================');

  try {
    await testPagination();
    await testNameFilter();
    await testKeyboardTypeFilter();
    await testKeyRangeFilter();
    await testCombinedFilters();

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
