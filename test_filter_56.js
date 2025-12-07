const BASE_URL = 'http://localhost:8000';

async function testFilter() {
  console.log('Testing 5*6 filter...\n');

  // Test 1: Direct API call with 5*6
  console.log('Test 1: Direct API call with key_ranges=5*6');
  const response1 = await fetch(`${BASE_URL}/api/keyboards?key_ranges=5*6`);
  const data1 = await response1.json();
  console.log(`Result: ${data1.keyboards.length} keyboards found`);
  data1.keyboards.forEach(kb => {
    console.log(`  - ${kb.name} (key_count_range: ${kb.key_count_range})`);
  });

  // Test 2: URL encoded
  console.log('\nTest 2: URL encoded (5%2A6)');
  const response2 = await fetch(`${BASE_URL}/api/keyboards?key_ranges=5%2A6`);
  const data2 = await response2.json();
  console.log(`Result: ${data2.keyboards.length} keyboards found`);
  data2.keyboards.forEach(kb => {
    console.log(`  - ${kb.name} (key_count_range: ${kb.key_count_range})`);
  });

  // Test 3: Using URLSearchParams (similar to axios)
  console.log('\nTest 3: Using URLSearchParams');
  const params = new URLSearchParams({ key_ranges: '5*6' });
  const response3 = await fetch(`${BASE_URL}/api/keyboards?${params.toString()}`);
  const data3 = await response3.json();
  console.log(`Result: ${data3.keyboards.length} keyboards found`);
  console.log(`URL: ${BASE_URL}/api/keyboards?${params.toString()}`);
  data3.keyboards.forEach(kb => {
    console.log(`  - ${kb.name} (key_count_range: ${kb.key_count_range})`);
  });

  // Test 4: Check all keyboards to see which have 5*6
  console.log('\nTest 4: All keyboards with key_count_range containing *');
  const response4 = await fetch(`${BASE_URL}/api/keyboards?limit=100`);
  const data4 = await response4.json();
  const withAsterisk = data4.keyboards.filter(kb => kb.key_count_range && kb.key_count_range.includes('*'));
  console.log(`Found ${withAsterisk.length} keyboards with * in key_count_range:`);
  withAsterisk.forEach(kb => {
    console.log(`  - ${kb.name}: ${kb.key_count_range}`);
  });
}

testFilter().catch(console.error);
