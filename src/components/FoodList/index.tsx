import React, { useEffect, useState } from 'react';

interface Place {
  id: number;
  title: string;
  lat: number;
  lng: number;
  placeId: string;
  description: string;
  category: string;
}

const mockData: Place[] = [
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

function FoodList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [placesPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // const response = await fetch('/api/places'); // Replace with your API endpoint
        // const data = await response.json();
        const data = mockData; // Use mock data for now
        setPlaces(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch places');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page on category change
  };

  const filteredPlaces = places.filter((place) =>
    (selectedCategory === '전체' || place.category === selectedCategory) &&
    place.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Food List</h1>
      <div className="flex mb-4 space-x-4">
        <input
          className="p-2 border border-gray-300 rounded"
          placeholder="Search by title"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="전체">전체</option>
          <option value="한식">한식</option>
          <option value="중식">중식</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {currentPlaces.map((place) => (
            <tr className="hover:bg-gray-100" key={place.id}>
              <td className="py-2 px-4 border-b">{place.title}</td>
              <td className="py-2 px-4 border-b">{place.category}</td>
              <td className="py-2 px-4 border-b">{place.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodList;