export type FoodCategory = 'ALL' | 'ASIAN' | 'CHINESE' | 'KOREAN' | 'WESTERN' | 'JAPANESE' | 'DESSERT';
export const categoryList: { value: FoodCategory; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'KOREAN', label: '한식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'ASIAN', label: '아시안' },
  { value: 'DESSERT', label: '디저트' },
];
