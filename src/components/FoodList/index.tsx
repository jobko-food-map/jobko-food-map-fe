import type { FoodCategory, V1AllPlaceGetResponse } from '@app/types/api';
import React, { useEffect, useState } from 'react';
import { categoryList } from '@app/types/api';
import Loading from '../Loading';

function FoodList() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('ALL');
  const [searchMethod, setSearchMethod] = useState<'name' | 'category'>('name'); // Search method state

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        pageNo: '0',
        pageSize: '100',
        isApprove: 'true',
      });

      try {
        const response = await fetch(`https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data: V1AllPlaceGetResponse = await response.json();
        setPlaces(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load places');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as FoodCategory);
  };

  const handleSearchMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMethod(e.target.value as 'name' | 'category');
    setSearchQuery(''); // Reset search query when switching methods
    setSelectedCategory('ALL'); // Reset category when switching methods
  };

  const filteredPlaces = () => {
    if (!places?.content) return [];
    if (searchMethod === 'name') {
      return places.content.filter(place => place.placeName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (searchMethod === 'category') {
      return places.content.filter(place => selectedCategory === 'ALL' || place.category === selectedCategory);
    }
    return [];
  };

  const handleMapViewClick = (placeId: string) => {
    window.open(`https://map.kakao.com/link/map/${placeId}`, '_blank');
  };

  if (loading) {
    return <Loading title='Loading places...' />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    places && (
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>맛집 목록</h1>
        <div className='flex mb-4 space-x-4'>
          <div className='flex items-center space-x-2'>
            <label>
              <input
                checked={searchMethod === 'name'}
                name='searchMethod'
                type='radio'
                value='name'
                onChange={handleSearchMethodChange}
              />
              이름으로 검색
            </label>
            <label>
              <input
                checked={searchMethod === 'category'}
                name='searchMethod'
                type='radio'
                value='category'
                onChange={handleSearchMethodChange}
              />
              카테고리로 검색
            </label>
          </div>
          {searchMethod === 'name' && (
            <input
              className='p-2 border border-gray-300 rounded'
              placeholder='Search by name'
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
          {searchMethod === 'category' && (
            <select
              className='p-2 border border-gray-300 rounded'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categoryList.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>이름</th>
              <th className='py-2 px-4 border-b'>카테고리</th>
              <th className='py-2 px-4 border-b'>설명</th>
              <th className='py-2 px-4 border-b'>지도보기</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces().map(place => (
              <tr className='hover:bg-gray-100' key={place.id}>
                <td className='py-2 px-4 border-b txt-center'>{place.placeName}</td>
                <td className='py-2 px-4 border-b txt-center'>
                  {categoryList.find(f => f.value === place.category)?.label}
                </td>
                <td className='py-2 px-4 border-b txt-center'>{place.placeDesc}</td>
                <td className='py-2 px-4 border-b txt-center'>
                  <button
                    className='bg-food-orange-300 hover:bg-food-orange-500 opacity-80 p-2 rounded-2xl text-white'
                    onClick={() => handleMapViewClick(place.placeId)}
                  >
                    지도보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default FoodList;
