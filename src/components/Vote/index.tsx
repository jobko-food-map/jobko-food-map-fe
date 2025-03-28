import { useSessionStore } from '@app/store';
import { categoryList, type ReportInfo } from '@app/types/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
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
    };

    fetchReports();
  }, [currentPage, pageSize]);

  const handleApprove = async (_report:ReportInfo) => {
    try {
      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userInfo?.userId, reportId: _report.id}),
      });
      if (response.ok) {
        alert('Report approved successfully!');
        setReports((prev) => ({
          ...prev!,
          content: prev!.content.filter((report) => report.id !== _report.id),
        }));
      } else {
        alert('Failed to approve report.');
      }
    } catch (err) {
      console.error('Error approving report:', err);
      alert('An error occurred while approving the report.');
    }
  };

  const handleReject = async (_report: ReportInfo) => {
    try {
      const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/vote`, {
        method: 'POST',
        body: JSON.stringify({ userId: userInfo?.userId, reportId: _report.id}),
        headers: {'Content-Type': 'application/json'},
      });
      if (response.ok) {
        alert('Report rejected successfully!');
        setReports((prev) => ({
          ...prev!,
          content: prev!.content.filter((report) => report.id !== _report.id),
        }));
      }
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert('An error occurred while rejecting the report.');
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/vote/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleMapViewÇlick = (placeId: string, e: MouseEvent) => {
    e.stopPropagation();
    window.open(`https://map.kakao.com/link/map/${placeId}`, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!reports) {
    return <div>No reports found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">제보된 장소</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">이름</th>
            <th className="py-2 px-4 border-b">카테고리</th>
            <th className="py-2 px-4 border-b">설명</th>
            <th className="py-2 px-4 border-b">지도보기</th>
            <th className="py-2 px-4 border-b">투표하기</th>
          </tr>
        </thead>
        <tbody>
          {reports.content.map((report) => (
            <tr
              className="hover:bg-gray-100 cursor-pointer"
              key={report.id}
              onClick={() => handleRowClick(report.id)}
            >
              <td className="py-2 px-4 border-b text-center align-middle">{report.placeName}</td>
              <td className="py-2 px-4 border-b text-center align-middle" >{categoryList.find(f => f.value === report.category)?.label}</td>
              <td className="py-2 px-4 border-b text-center align-middle">{report.placeDesc}</td>
              <td className="py-2 px-4 border-b text-center align-middle">
                <button className='bg-food-orange-300 opacity-80 p-2 rounded-2xl text-white hover:bg-food-orange-500' onClick={(e) => handleMapViewÇlick(report.placeId, e)}>지도보기</button>
              </td>
              <td className="py-2 px-4 border-b text-center align-middle">
                <button
                  className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(report);
                  }}
                >
                  좋아요: {report.approveCount}
                </button>
                <button
                  className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(report);
                  }}
                >
                  별로에요: {report.rejectCount}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: reports.totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Vote;