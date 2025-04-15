import type { ReportInfo } from '@app/types/api';
import type { ApiErrorResponse } from '@app/types/error';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSessionStore } from '@app/store';
import { categoryList } from '@app/types/api';
import Loading from '../Loading';

interface V1AllReportGetResponse {
  content: ReportInfo[];
  totalPages: number;
  totalElements: number;
}

const Vote = () => {
  const { userInfo } = useSessionStore();
  const [reports, setReports] = useState<V1AllReportGetResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [loadingReportIds, setLoadingReportIds] = useState<{ [key: number]: { approve?: boolean; reject?: boolean } }>(
    {},
  );
  const navigate = useNavigate();

  const fetchReports = useCallback(async () => {
    setError(null);

    const queryParams = new URLSearchParams({
      pageNo: currentPage.toString(),
      pageSize: pageSize.toString(),
    });

    try {
      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/report?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data: V1AllReportGetResponse = await response.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reports');
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!userInfo) {
      alert('로그인 후 사용해주세요.');
      window.location.href = '/';
    }
  }, [userInfo]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 투표 카운트 업데이트 헬퍼 함수
  const updateReportCount = (reportId: number, isApprove: boolean) => {
    if (!reports) return;

    setReports(prevReports => {
      if (!prevReports) return null;

      return {
        ...prevReports,
        content: prevReports.content.map(report => {
          if (report.id === reportId) {
            return {
              ...report,
              approveCount: isApprove ? report.approveCount + 1 : report.approveCount,
              rejectCount: !isApprove ? report.rejectCount + 1 : report.rejectCount,
            };
          }
          return report;
        }),
      };
    });
  };

  const handleApprove = async (_report: ReportInfo) => {
    try {
      // 버튼 로딩 상태 활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], approve: true } }));

      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userInfo?.userId, reportId: _report.id, isApprove: true }),
      });

      if (response.ok) {
        // 서버 응답이 성공한 경우에만 UI 업데이트
        updateReportCount(_report.id, true);
      } else {
        const errorData = (await response.json()) as ApiErrorResponse;
        alert(errorData.message);
      }
    } catch (err) {
      console.error('Error approving report:', err);
      alert('에러가 발생했습니다. 관리자에게 문의해주세요.');
    } finally {
      // 버튼 로딩 상태 비활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], approve: false } }));
    }
  };

  const handleReject = async (_report: ReportInfo) => {
    try {
      // 버튼 로딩 상태 활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], reject: true } }));

      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote`, {
        method: 'POST',
        body: JSON.stringify({ userId: userInfo?.userId, reportId: _report.id, isApprove: false }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // 서버 응답이 성공한 경우에만 UI 업데이트
        updateReportCount(_report.id, false);
      } else {
        const errorData = (await response.json()) as ApiErrorResponse;
        alert(errorData.message);
      }
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('에러가 발생했습니다. 관리자에게 문의해주세요.');
    } finally {
      // 버튼 로딩 상태 비활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], reject: false } }));
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/vote/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleMapViewClick = (placeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://map.kakao.com/link/map/${placeId}`, '_blank');
  };

  if (loading) {
    return <Loading title='투표하기 목록 로딩중...' />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!reports) {
    return <div>No reports found</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>제보된 장소</h1>
      <h3>좋아요/별로에요 차이가 5개 이상이면 자동으로 목록에 등록됩니다.</h3>
      <table className='min-w-full bg-white table-fixed'>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b w-1/4">이름</th>
            <th className="py-2 px-4 border-b w-1/6">카테고리</th>
            <th className="py-2 px-4 border-b w-1/4">설명</th>
            <th className="py-2 px-4 border-b w-1/6">지도보기</th>
            <th className="py-2 px-4 border-b w-1/4">투표하기</th>
          </tr>
        </thead>
        <tbody>
          {reports.content.map(report => (
            <tr
              className='hover:bg-gray-100 cursor-pointer'
              key={report.id}
              // onClick={() => handleRowClick(report.id)}
            >
              <td className='py-2 px-4 border-b text-center align-middle'>{report.placeName}</td>
              <td className='py-2 px-4 border-b text-center align-middle'>
                {categoryList.find(f => f.value === report.category)?.label}
              </td>
              <td className='py-2 px-4 border-b text-center align-middle'>{report.placeDesc}</td>
              <td className='py-2 px-4 border-b text-center align-middle'>
                <button
                  className='bg-food-orange-300 opacity-80 p-2 rounded-2xl text-white hover:bg-food-orange-500'
                  onClick={e => handleMapViewClick(report.placeId, e)}
                >
                  지도보기
                </button>
              </td>
              <td className='py-2 px-4 border-b text-center align-middle'>
                <button
                  className='bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 mr-2 min-w-[100px]'
                  disabled={loadingReportIds[report.id]?.approve}
                  onClick={e => {
                    e.stopPropagation();
                    handleApprove(report);
                  }}
                >
                  {loadingReportIds[report.id]?.approve ? (
                    <div className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1'></div>
                  ) : (
                    '좋아요: ' + report.approveCount
                  )}
                </button>
                <button
                  className='bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 min-w-[100px]'
                  disabled={loadingReportIds[report.id]?.reject}
                  onClick={e => {
                    e.stopPropagation();
                    handleReject(report);
                  }}
                >
                  {loadingReportIds[report.id]?.reject ? (
                    <div className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1'></div>
                  ) : (
                    '별로에요: ' + report.rejectCount
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-center mt-4'>
        {Array.from({ length: reports.totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === index ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Vote;
