export const paths = {
  root: {
    path: '/',
    getHref: () => '/',
  },
  map: {
    path: 'map',
    getHref: () => '/map',
  },
  //제보하기
  report: {
    path: 'report',
    getHref: () => '/report',
  },
} as const;
