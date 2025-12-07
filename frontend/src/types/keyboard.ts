// 키 개수 범위 (문자열로 자유롭게 입력 가능)
export type KeyRange = string;

// 키보드 종류
export type KeyboardType = 'typewriter' | 'alice' | 'ortholinear' | 'column_stagger' | 'splay' | 'none';

// 정렬 옵션
export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

// 가격 필터 옵션
export type PriceFilter = 'all' | 'with_price' | 'diy_only';

// 키보드 태그 (무선, 커서조작만 남김)
export interface KeyboardTags {
  is_wireless: boolean;
  has_cursor_control: boolean;
}

// 키보드
export interface Keyboard {
  id: number;
  name: string;
  price: number | null;
  link: string;
  image_url: string;
  key_count_range: KeyRange;
  keyboard_type: KeyboardType;
  tags: KeyboardTags;
  created_at: string;
  updated_at: string;
}

// 필터 상태
export interface FilterState {
  priceRange: [number, number];
  priceFilter: PriceFilter; // 'all' | 'with_price' | 'diy_only'
  keyRanges: KeyRange[];
  keyboardType: KeyboardType | null; // 키보드 종류 필터
  isWireless: boolean | null;
  hasCursorControl: boolean | null;
  searchQuery: string;
  sortBy: SortOption;
}

// 키보드 목록 응답
export interface KeyboardListResponse {
  keyboards: Keyboard[];
  total: number;
  page: number;
  total_pages: number;
}

// 키보드 비교 요청
export interface KeyboardCompareRequest {
  keyboard_ids: number[];
}

// 키보드 비교 응답
export interface KeyboardCompareResponse {
  keyboards: Keyboard[];
}

// 비교 상태
export interface ComparisonState {
  selectedIds: number[];
  keyboards: Keyboard[];
  isModalOpen: boolean;
}
