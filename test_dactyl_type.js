// 댁틸 키보드 타입 추가 테스트
const tests = [
  {
    name: '백엔드 KeyboardType enum에 dactyl 포함 확인',
    file: 'backend/app/models.py',
    expected: 'dactyl = "dactyl"  # 댁틸'
  },
  {
    name: '백엔드 schemas.py에 dactyl 포함 확인',
    file: 'backend/app/schemas.py',
    expected: 'dactyl = "dactyl"  # 댁틸'
  },
  {
    name: '프론트엔드 타입 정의에 dactyl 포함 확인',
    file: 'frontend/src/types/keyboard.ts',
    expected: "'dactyl'"
  },
  {
    name: 'FilterPanel에 댁틸 옵션 포함 확인',
    file: 'frontend/src/components/keyboard/FilterPanel.tsx',
    expected: "{ value: 'dactyl', label: '댁틸' }"
  },
  {
    name: 'KeyboardForm에 댁틸 옵션 포함 확인',
    file: 'frontend/src/components/admin/KeyboardForm.tsx',
    expected: '<option value="dactyl">댁틸</option>'
  },
  {
    name: 'KeyboardCard에 댁틸 라벨 포함 확인',
    file: 'frontend/src/components/keyboard/KeyboardCard.tsx',
    expected: "keyboard.keyboard_type === 'dactyl' && '댁틸'"
  }
];

const fs = require('fs');
const path = require('path');

console.log('=== 댁틸 키보드 타입 추가 테스트 ===\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const filePath = path.join(__dirname, test.file);

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(test.expected)) {
      console.log(`✓ 테스트 ${index + 1}: ${test.name}`);
      passed++;
    } else {
      console.log(`✗ 테스트 ${index + 1}: ${test.name}`);
      console.log(`  예상: "${test.expected}" 포함`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ 테스트 ${index + 1}: ${test.name}`);
    console.log(`  에러: ${error.message}`);
    failed++;
  }
});

console.log(`\n=== 테스트 결과 ===`);
console.log(`통과: ${passed}/${tests.length}`);
console.log(`실패: ${failed}/${tests.length}`);

if (failed === 0) {
  console.log('\n✅ 모든 테스트 통과! 댁틸 키보드 타입이 성공적으로 추가되었습니다.');
} else {
  console.log('\n❌ 일부 테스트 실패. 파일을 확인해주세요.');
  process.exit(1);
}
