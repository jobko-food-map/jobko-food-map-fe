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
    path: 'admin/report',
    getHref: () => '/admin/report',
  },

} as const;
