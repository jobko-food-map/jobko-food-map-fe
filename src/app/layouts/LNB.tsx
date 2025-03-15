import { Link } from 'react-router';
import { paths } from '@app/configs/paths';

const LNB = () => {
  return (
    <div className='w-64 bg-gray-100 p-4 border-r border-gray-300'>
      <h2 className='text-xl font-bold mb-4'>메뉴</h2>
      <ul className='space-y-2'>
        <li>
          <Link className='text-gray-700 hover:text-gray-900' to={paths.map.getHref()}>
            지도
          </Link>
        </li>
        <li>
          <Link className='text-gray-700 hover:text-gray-900' to={paths.report.getHref()}>
            제보하기
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LNB;
