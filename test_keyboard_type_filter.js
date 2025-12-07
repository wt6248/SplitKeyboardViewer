// Integration test for keyboard_type filter
const API_BASE = 'http://localhost:8000';

async function testKeyboardTypeFilter() {
  console.log('[TEST] Starting keyboard_type filter integration test\n');

  // Test 1: Fetch all keyboards
  console.log('[TEST 1] Fetching all keyboards...');
  const allResponse = await fetch(`${API_BASE}/api/keyboards?page=1&limit=20`);
  const allData = await allResponse.json();
  console.log(`[OK] Total keyboards: ${allData.total}`);
  console.log(`[OK] Keyboards on page 1: ${allData.keyboards.length}\n`);

  // Display keyboard types
  console.log('[INFO] Keyboard types in database:');
  const typeCount = {};
  allData.keyboards.forEach(kb => {
    const type = kb.keyboard_type || 'none';
    typeCount[type] = (typeCount[type] || 0) + 1;
    console.log(`  - ${kb.name}: ${type}`);
  });
  console.log('\n[INFO] Type distribution:');
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count}`);
  });
  console.log('');

  // Test 2: Filter by ortholinear
  console.log('[TEST 2] Filtering by keyboard_type=ortholinear...');
  const orthoResponse = await fetch(`${API_BASE}/api/keyboards?keyboard_type=ortholinear&page=1&limit=20`);
  const orthoData = await orthoResponse.json();
  console.log(`[OK] Found ${orthoData.total} ortholinear keyboards`);
  orthoData.keyboards.forEach(kb => {
    console.log(`  - ${kb.name}: ${kb.keyboard_type}`);
    if (kb.keyboard_type !== 'ortholinear') {
      console.log(`[ERROR] Expected ortholinear but got ${kb.keyboard_type}`);
    }
  });
  console.log('');

  // Test 3: Filter by column_stagger
  console.log('[TEST 3] Filtering by keyboard_type=column_stagger...');
  const colResponse = await fetch(`${API_BASE}/api/keyboards?keyboard_type=column_stagger&page=1&limit=20`);
  const colData = await colResponse.json();
  console.log(`[OK] Found ${colData.total} column_stagger keyboards`);
  colData.keyboards.forEach(kb => {
    console.log(`  - ${kb.name}: ${kb.keyboard_type}`);
    if (kb.keyboard_type !== 'column_stagger') {
      console.log(`[ERROR] Expected column_stagger but got ${kb.keyboard_type}`);
    }
  });
  console.log('');

  // Test 4: Filter by splay
  console.log('[TEST 4] Filtering by keyboard_type=splay...');
  const splayResponse = await fetch(`${API_BASE}/api/keyboards?keyboard_type=splay&page=1&limit=20`);
  const splayData = await splayResponse.json();
  console.log(`[OK] Found ${splayData.total} splay keyboards`);
  splayData.keyboards.forEach(kb => {
    console.log(`  - ${kb.name}: ${kb.keyboard_type}`);
    if (kb.keyboard_type !== 'splay') {
      console.log(`[ERROR] Expected splay but got ${kb.keyboard_type}`);
    }
  });
  console.log('');

  // Test 5: Verify tags are simplified
  console.log('[TEST 5] Verifying simplified tag structure...');
  const sampleKb = allData.keyboards[0];
  console.log(`[INFO] Sample keyboard tags for "${sampleKb.name}":`);
  console.log(`  - is_wireless: ${sampleKb.tags.is_wireless}`);
  console.log(`  - has_cursor_control: ${sampleKb.tags.has_cursor_control}`);

  const expectedTagKeys = ['is_wireless', 'has_cursor_control'];
  const actualTagKeys = Object.keys(sampleKb.tags).sort();

  if (JSON.stringify(actualTagKeys) === JSON.stringify(expectedTagKeys.sort())) {
    console.log('[OK] Tags structure is correct (only is_wireless and has_cursor_control)\n');
  } else {
    console.log(`[ERROR] Expected tags: ${expectedTagKeys.join(', ')}`);
    console.log(`[ERROR] Actual tags: ${actualTagKeys.join(', ')}\n`);
  }

  console.log('[SUCCESS] All tests completed!');
}

// Run tests
testKeyboardTypeFilter().catch(err => {
  console.error('[ERROR] Test failed:', err.message);
  process.exit(1);
});
