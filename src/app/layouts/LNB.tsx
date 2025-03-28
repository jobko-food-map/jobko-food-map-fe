import BaseLink from '@app/components/BaseLink';
import { paths } from '@app/configs/paths';

const LNB = () => {
  return (
    <div className='w-64 bg-gray-100 p-4 border-r border-gray-300'>
      <h2 className='text-xl font-bold mb-4'>메뉴</h2>
      <ul className='space-y-2'>
        <li>
          <BaseLink className='text-gray-700 hover:text-gray-900' to={paths.map.getHref()}>
            지도로 보기
          </BaseLink>
        </li>
        <li>
          <BaseLink className='text-gray-700 hover:text-gray-900' to={paths.list.getHref()}>
            목록으로 보기
          </BaseLink>
        </li>
        <li>
          <BaseLink className='text-gray-700 hover:text-gray-900' to={paths.report.getHref()}>
            제보하기
          </BaseLink>
        </li>
        <li>
          <BaseLink className='text-gray-700 hover:text-gray-900' to={paths.adminReport.getHref()}>
            투표하기
          </BaseLink>
        </li>
        <li>
          <BaseLink className='text-gray-700 hover:text-gray-900' to={paths.rejectFoodList.getHref()}>
            탈락한 음식 목록
          </BaseLink>
        </li>
      </ul>
    </div>
  );
};

export default LNB;
