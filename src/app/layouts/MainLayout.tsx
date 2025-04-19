import { Outlet } from 'react-router';
import GNB from './GNB';
import LNB from './LNB';

const MainLayout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50'>
      <GNB />
      <div className='flex pt-16'>
        <LNB />
        <main className='flex-1 md:ml-[240px] p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
