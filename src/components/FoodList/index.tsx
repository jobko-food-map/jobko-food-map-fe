import type { V1AllPlaceGetResponse } from '@app/types/api';
import React, { useEffect, useState } from 'react';

function FoodList() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [placesPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        pageNo: currentPage.toString(),
        pageSize: placesPerPage.toString(),
        isApprove: 'true',
      });

      try {
        const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        setPlaces(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load places');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [currentPage, placesPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to the first page on category change
  };

  const filteredPlaces = places?.content.filter(
    (place) =>
      (selectedCategory === '전체' || place.category === selectedCategory) &&
      place.placeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return places && (
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
          <option value="일식">일식</option>
          <option value="양식">양식</option>
          <option value="디저트">디저트</option>
        </select>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Approval Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlaces?.map((place) => (
            <tr className="hover:bg-gray-100" key={place.id}>
              <td className="py-2 px-4 border-b">{place.placeName}</td>
              <td className="py-2 px-4 border-b">{place.category}</td>
              <td className="py-2 px-4 border-b">{place.placeDesc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: places.totalPages }, (_, index) => (
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
}

export default FoodList;