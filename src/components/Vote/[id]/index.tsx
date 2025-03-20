import React, { useEffect, useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { useParams } from 'react-router';

interface Report {
  id: number;
  title: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
}

const VoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/report/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        setReport(data);
        setLoading(false);
      } catch (err) {
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
      if (response.ok) {
        alert('Report approved successfully!');
      } else {
        alert('Failed to approve report.');
      }
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
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">{error}</div>;
  }

  if (!report) {
    return <div className="p-4">Report not found</div>;
  }

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Report Detail</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{report.title}</h2>
        <p className="text-gray-700">{report.description}</p>
        <p className="text-gray-700">Category: {report.category}</p>
      </div>
      <div className="mb-4">
        <KaKaoMap center={{ lat: report.lat, lng: report.lng }} level={3} style={{ width: '100%', height: '400px' }}>
          <MapMarker position={{ lat: report.lat, lng: report.lng }} title={report.title} />
        </KaKaoMap>
      </div>
      <div className="absolute bottom-4 flex space-x-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleApprove}>
          Approve
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default VoteDetail;