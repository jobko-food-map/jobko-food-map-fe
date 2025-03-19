import { useEffect, useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { useParams } from 'react-router';

interface Place {
  id: number;
  title: string;
  lat: number;
  lng: number;
  placeId: string;
  description: string;
  category: string;
}

const mockReports: Place[] = [
  {
    id: 1,
    title: 'Sample Place 1',
    lat: 37.5665,
    lng: 126.978,
    placeId: '1',
    description: 'Description for Sample Place 1',
    category: '한식',
  },
  {
    id: 2,
    title: 'Sample Place 2',
    lat: 37.5665,
    lng: 126.978,
    placeId: '2',
    description: 'Description for Sample Place 2',
    category: '중식',
  },
  // Add more mock data as needed
];

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Place | null>(null);

  useEffect(() => {
    // Fetch the report details using the id
    const foundReport = mockReports.find(report => report.id === parseInt(id || ''));
    setReport(foundReport || null);
  }, [id]);

  const handleApprove = () => {
    console.log(`Approved report with id: ${id}`);
    // Add your approval logic here
  };

  const handleReject = () => {
    console.log(`Rejected report with id: ${id}`);
    // Add your rejection logic here
  };

  if (!report) {
    return <div className='p-4'>Report not found</div>;
  }

  return (
    <div className='p-4 relative'>
      <h1 className='text-2xl font-bold mb-4'>Report Detail</h1>
      <div className='mb-4'>
        <h2 className='text-xl font-bold'>{report.title}</h2>
        <p className='text-gray-700'>{report.description}</p>
        <p className='text-gray-700'>Category: {report.category}</p>
      </div>
      <div className='mb-4'>
        <KaKaoMap center={{ lat: report.lat, lng: report.lng }} level={3} style={{ width: '100%', height: '400px' }}>
          <MapMarker position={{ lat: report.lat, lng: report.lng }} title={report.title} />
        </KaKaoMap>
      </div>
      <div className='bottom-4 flex space-x-2'>
        <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600' onClick={handleApprove}>
          Approve
        </button>
        <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default ReportDetail;
