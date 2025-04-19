import BaseLink from '@app/components/BaseLink';
import { paths } from '@app/configs/paths';
import { useSessionStore } from '@app/store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const LNB = () => {
  const { userInfo } = useSessionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { path: paths.map.getHref(), label: '지도로 보기', icon: '🗺️', color: 'from-blue-600 to-blue-700' },
    { path: paths.list.getHref(), label: '목록으로 보기', icon: '📋', color: 'from-green-600 to-green-700' },
    { path: paths.report.getHref(), label: '제보하기', icon: '✏️', color: 'from-purple-600 to-purple-700' },
    { path: paths.adminReport.getHref(), label: '투표하기', icon: '🗳️', color: 'from-pink-600 to-pink-700' },
    { path: paths.rejectFoodList.getHref(), label: '탈락한 음식 목록', icon: '❌', color: 'from-red-600 to-red-700' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className='md:hidden fixed bottom-4 right-4 bg-gradient-to-r from-food-pink-300 to-food-pink-400 text-white pt-2.5 pb-3 pr-4 pl-4 rounded-4xl shadow-lg z-50 hover:shadow-xl transition-all duration-300'
        onClick={() => setIsOpen(!isOpen)}
        type='button'
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && isMobile && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-opacity duration-300'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed bottom-0 left-0 right-0 transform transition-all duration-300 ease-in-out ${
                isOpen ? 'translate-y-0' : 'translate-y-full'
              }`
            : 'hidden md:block'
        } bg-white/90 backdrop-blur-md shadow-xl rounded-t-2xl md:rounded-none md:shadow-none md:w-[240px] md:fixed md:left-0 md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto z-50`}
      >
        <div className='p-6'>
          <ul className='space-y-2'>
            {menuItems.map(item => (
              <li key={item.path}>
                <BaseLink
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-white ring-opacity-50`
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:scale-105'
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                  to={item.path}
                >
                  <span className='text-2xl'>{item.icon}</span>
                  <span className='font-medium'>{item.label}</span>
                </BaseLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default LNB;
