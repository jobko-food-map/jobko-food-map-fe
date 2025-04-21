import BaseButton from '@app/components/BaseButton';
import Loading from '@app/components/Loading';
import { useSessionStore } from '@app/store/lib/useSessionStore';
import type { ReportInfo } from '@app/types/api';
import { categoryList } from '@app/types/api';
import type { ApiErrorResponse } from '@app/types/error';
import { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router';

const VoteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useSessionStore();
  const alertShown = useRef(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/${id}/report`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        setReport(data);
        setLoading(false);
      } catch {
        setError('Failed to load report');
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleApprove = async () => {
    if (!userInfo) {
      alert('로그인 후 투표해주세요.');
      return;
    }

    try {
      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userInfo?.userId, reportId: id, isApprove: true }),
      });

      if (response.ok) {
        alert('소중한 한표 감사드립니다.');
      } else {
        const errorData = (await response.json()) as ApiErrorResponse;
        alert(errorData.message);
      }
    } catch (err) {
      console.error('Error approving report:', err);
      alert('An error occurred while approving the report.');
    }
  };

  const handleReject = async () => {
    if (!userInfo) {
      alert('로그인 후 투표해주세요.');
      return;
    }

    try {
      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote', {
        method: 'POST',
        body: JSON.stringify({ userId: userInfo?.userId, reportId: id, isApprove: false }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('소중한 한표 감사드립니다.');
      } else {
        const errorData = (await response.json()) as ApiErrorResponse;
        alert(errorData.message);
      }
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('An error occurred while rejecting the report.');
    }
  };

  if (loading) {
    return <Loading title='상세화면 로딩중...' />;
  }

  if (error) {
    return <div className='p-4'>{error}</div>;
  }

  if (!report) {
    return <div className='p-4'>Report not found</div>;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 sm:p-8'>
            <div className='flex items-center gap-4 mb-6'>
              <BaseButton
                className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'
                onClick={() => navigate(-1)}
              >
                <IoArrowBack className='w-6 h-6 text-gray-600' />
              </BaseButton>
              <h1 className='text-3xl font-bold text-gray-900'>투표 상세</h1>
            </div>

            <div className='space-y-6'>
              <div className='bg-gray-50 rounded-xl p-6'>
                <div className='flex items-center gap-3 mb-4'>
                  <h2 className='text-2xl font-semibold text-gray-900'>{report.placeName}</h2>
                  <span className='text-xl'>
                    {report.category === 'KOREAN' && '🍚'}
                    {report.category === 'CHINESE' && '🥢'}
                    {report.category === 'JAPANESE' && '🍣'}
                    {report.category === 'WESTERN' && '🍝'}
                    {report.category === 'ASIAN' && '🍜'}
                    {report.category === 'DESSERT' && '🍰'}
                  </span>
                </div>
                <div className='space-y-2'>
                  <p className='text-gray-600'>{report.placeDesc}</p>
                  <p className='text-sm text-gray-500'>
                    카테고리: {categoryList.find(f => f.value === report.category)?.label}
                  </p>
                </div>
              </div>

              <div className='bg-gray-50 rounded-xl overflow-hidden'>
                <h3 className='text-lg font-semibold text-gray-900 p-4'>위치</h3>
                <KaKaoMap
                  center={{ lat: report.lat, lng: report.lng }}
                  level={3}
                  style={{ width: '100%', height: '400px' }}
                >
                  <MapMarker position={{ lat: report.lat, lng: report.lng }} title={report.placeName} />
                </KaKaoMap>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
                <BaseButton
                  className='flex-1 bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2'
                  onClick={handleApprove}
                >
                  <span className='text-lg'>👍</span>
                  <span>좋아요</span>
                </BaseButton>
                <BaseButton
                  className='flex-1 bg-red-400 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2'
                  onClick={handleReject}
                >
                  <span className='text-lg'>👎</span>
                  <span>별로에요</span>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteDetail;
