export const paths = {
  root: {
    path: '/',
    getHref: () => '/',
  },
  map: {
    path: 'map',
    getHref: () => '/map',
  },
  // 목록으로 보기
  list: {
    path: 'list',
    getHref: () => '/list',
  },
  //제보하기
  report: {
    path: 'report',
    getHref: () => '/report',
  },
  //제보 관리 페이지
  adminReport: {
    path: 'vote',
    getHref: () => '/vote',
  },
  //탈락한 음식 보기
  rejectFoodList: {
    path: 'reject',
    getHref: () => '/reject',
  },
  //랜덤 음식 추천
  randomFood: {
    path: 'random',
    getHref: () => '/random',
  },
} as const;
