const AppRoot = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6'>오늘 점심 뭐먹지...? 🍽️</h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            잡코리아&알바몬 점메추 서비스에 오신 여러분을 환영합니다!
            <br />
            로그인 후, 점심메뉴를 제보하고 투표해보세요!
          </p>
        </div>

        {/* Team Section */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Our Team</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>김용희</h3>
              <p className='text-gray-600'>AM사용성개선스쿼드 - PM</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>이영철</h3>
              <p className='text-gray-600'>FE플랫폼 - 프론트엔드 담당</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>양지원</h3>
              <p className='text-gray-600'>커넥션스쿼드 - 백엔드 담당</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>유선영</h3>
              <p className='text-gray-600'>FE플랫폼 - 디자인 담당</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>김승미</h3>
              <p className='text-gray-600'>AM사용성개선스쿼드 - 프론트엔드 담당</p>
            </div>
          </div>
        </div>

        {/* Notice Section */}
        <div className='mt-16 bg-blue-50 rounded-xl p-6 max-w-3xl mx-auto'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4 text-center'>공지사항</h2>
          <div className='bg-white rounded-lg p-4 shadow-sm'>
            <p className='text-gray-600'>서버 메모리가 작아서 느려요.. 무료 버전이라 양해 부탁드립니다.☺️</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-50 border-t mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Special Thanks</h3>
            <div className='bg-white rounded-lg p-4 shadow-sm max-w-md mx-auto mb-4'>
              <p className='text-gray-600'>오동환(커넥션스쿼드) - PM</p>
            </div>
            <p className='text-gray-500'>이 프로젝트는 여러분의 도움으로 만들어졌습니다. 감사합니다! 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppRoot;
