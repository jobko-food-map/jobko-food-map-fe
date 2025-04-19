import { useSessionStore } from '@app/store';
import type { ReportInfo } from '@app/types/api';
import type { ApiErrorResponse } from '@app/types/error';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import BaseButton from '../BaseButton';
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
  const alertShown = useRef(false);

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
    if (!userInfo) {
      alert('로그인 후 투표해주세요.');
      return;
    }

    try {
      // 버튼 로딩 상태 활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], approve: true } }));

      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote', {
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
    if (!userInfo) {
      alert('로그인 후 투표해주세요.');
      return;
    }

    try {
      // 버튼 로딩 상태 활성화
      setLoadingReportIds(prev => ({ ...prev, [_report.id]: { ...prev[_report.id], reject: true } }));

      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote', {
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
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 sm:p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>제보된 장소</h1>
            <p className='text-gray-600 mb-8'>좋아요/별로에요 차이가 5개 이상이면 자동으로 목록에 등록됩니다.</p>

            <div className='overflow-x-auto'>
              <div className='min-w-full divide-y divide-gray-200'>
                {reports.content.map(report => (
                  <div
                    className='p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer'
                    key={report.id}
                    onClick={() => handleRowClick(report.id)}
                  >
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <h3 className='text-xl font-semibold text-gray-900'>{report.placeName}</h3>
                          <span className='text-lg'>
                            {report.category === 'KOREAN' && '🍚'}
                            {report.category === 'CHINESE' && '🥢'}
                            {report.category === 'JAPANESE' && '🍣'}
                            {report.category === 'WESTERN' && '🍝'}
                            {report.category === 'ASIAN' && '🍜'}
                            {report.category === 'DESSERT' && '🍰'}
                          </span>
                        </div>
                        <p className='text-gray-600'>{report.placeDesc}</p>
                      </div>

                      <div className='flex flex-col sm:flex-row gap-3'>
                        <BaseButton
                          className='bg-food-orange-300 text-white px-4 py-2 rounded-lg hover:bg-food-orange-500 transition-colors duration-200 flex items-center justify-center gap-2'
                          onClick={e => handleMapViewClick(report.placeId, e)}
                        >
                          <span>지도보기</span>
                        </BaseButton>

                        <div className='flex gap-2'>
                          <BaseButton
                            className='bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 min-w-[120px]'
                            disabled={loadingReportIds[report.id]?.approve}
                            onClick={e => {
                              e.stopPropagation();
                              handleApprove(report);
                            }}
                          >
                            {loadingReportIds[report.id]?.approve ? (
                              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            ) : (
                              <>
                                <span>좋아요</span>
                                <span className='bg-white/20 px-2 py-0.5 rounded-full text-sm'>
                                  {report.approveCount}
                                </span>
                              </>
                            )}
                          </BaseButton>

                          <BaseButton
                            className='bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 min-w-[120px]'
                            disabled={loadingReportIds[report.id]?.reject}
                            onClick={e => {
                              e.stopPropagation();
                              handleReject(report);
                            }}
                          >
                            {loadingReportIds[report.id]?.reject ? (
                              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            ) : (
                              <>
                                <span>별로에요</span>
                                <span className='bg-white/20 px-2 py-0.5 rounded-full text-sm'>
                                  {report.rejectCount}
                                </span>
                              </>
                            )}
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex justify-center mt-8'>
              <div className='flex gap-2'>
                {Array.from({ length: reports.totalPages }, (_, index) => (
                  <BaseButton
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      currentPage === index
                        ? 'bg-food-orange-300 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    key={index}
                    onClick={() => handlePageChange(index)}
                  >
                    {index + 1}
                  </BaseButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vote;
