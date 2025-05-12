import type { FoodCategory, V1AllPlaceGetResponse } from '@app/types/api';
import { categoryList } from '@app/types/api';
import type React from 'react';
import { useEffect, useState } from 'react';
import Loading from '@app/components/Loading';

function RejectFoodList() {
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
        isApprove: 'false',
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (loading) {
    return <Loading title='목록 불러오는 중 입니다.' />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    places && (
      <div className='p-6 max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>탈락한 음식점</h1>
          <p className='text-gray-600'>별로에요 투표로 인해 아쉽게 빛을 보지 못한 음식점 입니다</p>
          <p className='text-gray-600'>누군가에게는 맛집입니다</p>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='flex flex-col lg:flex-row lg:items-center gap-4 mb-4 min-h-[120px] lg:h-[120px]'>
            <div className='flex space-x-6'>
              <label className='relative flex items-center cursor-pointer group'>
                <input
                  checked={searchMethod === 'name'}
                  className='sr-only peer'
                  name='searchMethod'
                  onChange={handleSearchMethodChange}
                  type='radio'
                  value='name'
                />
                <div className='w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 group-hover:border-blue-400'>
                  <div className='w-2 h-2 bg-white rounded-full m-auto mt-1.5 peer-checked:opacity-100 opacity-0 transition-opacity duration-200' />
                </div>
                <span className='ml-2 text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-200'>
                  이름으로 검색
                </span>
              </label>

              <label className='relative flex items-center cursor-pointer group'>
                <input
                  checked={searchMethod === 'category'}
                  className='sr-only peer'
                  name='searchMethod'
                  onChange={handleSearchMethodChange}
                  type='radio'
                  value='category'
                />
                <div className='w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 group-hover:border-blue-400'>
                  <div className='w-2 h-2 bg-white rounded-full m-auto mt-1.5 peer-checked:opacity-100 opacity-0 transition-opacity duration-200' />
                </div>
                <span className='ml-2 text-gray-700 font-medium group-hover:text-blue-500 transition-colors duration-200'>
                  카테고리로 검색
                </span>
              </label>
            </div>

            {searchMethod === 'name' && (
              <div className='flex-1'>
                <input
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  onChange={handleSearchChange}
                  placeholder='음식점 이름을 입력하세요'
                  type='text'
                  value={searchQuery}
                />
              </div>
            )}

            {searchMethod === 'category' && (
              <div className='flex-1'>
                <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-2'>
                  {categoryList.map(category => (
                    <label
                      className={`relative flex flex-col items-center p-3 lg:p-4 px-5 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedCategory === category.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      key={category.value}
                    >
                      <input
                        checked={selectedCategory === category.value}
                        className='sr-only'
                        name='category'
                        onChange={handleCategoryChange}
                        type='radio'
                        value={category.value}
                      />
                      <div className='text-2xl lg:text-3xl mb-2 lg:mb-3'>
                        {category.value === 'ALL' && '🍽️'}
                        {category.value === 'KOREAN' && '🍚'}
                        {category.value === 'CHINESE' && '🥢'}
                        {category.value === 'JAPANESE' && '🍣'}
                        {category.value === 'WESTERN' && '🍝'}
                        {category.value === 'ASIAN' && '🍜'}
                        {category.value === 'DESSERT' && '🍰'}
                      </div>
                      <span className='text-xs lg:text-sm font-medium text-gray-700 text-center'>{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>이름</th>
              <th className='py-2 px-4 border-b'>카테고리</th>
              <th className='py-2 px-4 border-b'>설명</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default RejectFoodList;
