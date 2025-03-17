import React, { useState } from 'react';
import { useNavigate } from 'react-router';

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
    lng: 126.9780,
    placeId: '1',
    description: 'Description for Sample Place 1',
    category: '한식',
  },
  {
    id: 2,
    title: 'Sample Place 2',
    lat: 37.5665,
    lng: 126.9780,
    placeId: '2',
    description: 'Description for Sample Place 2',
    category: '중식',
  },
  // Add more mock data as needed
];

const AdminReport = () => {
  const [reports, setReports] = useState<Place[]>(mockReports);
  const navigate = useNavigate();

  const handleApprove = (id: number) => {
    console.log(`Approved report with id: ${id}`);
    // Add your approval logic here
  };

  const handleReject = (id: number) => {
    console.log(`Rejected report with id: ${id}`);
    // Add your rejection logic here
  };

  const handleRowClick = (id: number) => {
    navigate(`/admin/report/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reported Places</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr className="hover:bg-gray-100 cursor-pointer" key={report.id} onClick={() => handleRowClick(report.id)}>
              <td className="py-2 px-4 border-b">{report.title}</td>
              <td className="py-2 px-4 border-b">{report.category}</td>
              <td className="py-2 px-4 border-b">{report.description}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(report.id);
                  }}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(report.id);
                  }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReport;