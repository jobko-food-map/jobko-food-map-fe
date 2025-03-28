import { Outlet } from 'react-router';
import GNB from './GNB';
import LNB from './LNB';

const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <GNB />
      <div className='flex flex-1'>
        <LNB />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
