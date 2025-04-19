import BaseButton from '@app/components/BaseButton';
import Loading from '@app/components/Loading';
import { useSessionStore } from '@app/store/lib/useSessionStore';
import type { ReportInfo } from '@app/types/api';
import { categoryList } from '@app/types/api';
import { useEffect, useRef, useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

const VoteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useSessionStore();
  const alertShown = useRef(false);

  useEffect(() => {
    if (!userInfo && !alertShown.current) {
      alertShown.current = true;
      alert('로그인 후 사용해주세요.');
      navigate('/');
    }
  }, [userInfo, navigate]);

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
    try {
      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/report/${id}/approve`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error approving report:', err);
      alert('An error occurred while approving the report.');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/report/${id}/reject`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Report rejected successfully!');
      } else {
        alert('Failed to reject report.');
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
    <div className='p-4 relative'>
      <h1 className='text-2xl font-bold mb-4'>투표 상세</h1>
      <div className='mb-4'>
        <h2 className='text-xl font-bold'>{report.placeName}</h2>
        <p className='text-gray-700'>설명: {report.placeDesc}</p>
        <p className='text-gray-700'>카테고리: {categoryList.find(f => f.value === report.category)?.label}</p>
      </div>
      <div className='mb-4'>
        <h2>위치</h2>
        <KaKaoMap center={{ lat: report.lat, lng: report.lng }} level={3} style={{ width: '100%', height: '400px' }}>
          <MapMarker position={{ lat: report.lat, lng: report.lng }} title={report.placeName} />
        </KaKaoMap>
      </div>
      <div className='bottom-4 flex space-x-2'>
        <BaseButton className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600' onClick={handleApprove}>
          좋아요
        </BaseButton>
        <BaseButton className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' onClick={handleReject}>
          별로에요
        </BaseButton>
      </div>
    </div>
  );
};

export default VoteDetail;
