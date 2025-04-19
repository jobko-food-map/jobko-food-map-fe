import type { V1AllPlaceGetResponse } from '@app/types/api';
import type { FoodCategory } from '@app/types/api/enum';
import { categoryList } from '@app/types/api/enum';
import type React from 'react';
import { useEffect, useState } from 'react';
import BaseButton from '../BaseButton';
import Loading from '../Loading';

function FoodList() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMethod, setSearchMethod] = useState<'name' | 'category'>('name');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          'https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?pageNo=0&pageSize=100&isApprove=true',
        );
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
    setSelectedCategory(e.target.value as FoodCategory | 'ALL');
  };

  const handleSearchMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMethod(e.target.value as 'name' | 'category');
  };

  const handleMapViewClick = (placeId: string) => {
    window.open(`https://map.kakao.com/link/map/${placeId}`, '_blank');
  };

  const filteredPlaces = () => {
    if (!places?.content) return [];
    let filtered = places.content;

    if (searchMethod === 'name' && searchQuery) {
      filtered = filtered.filter(place => place.placeName.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (searchMethod === 'category' && selectedCategory !== 'ALL') {
      filtered = filtered.filter(place => place.category === selectedCategory);
    }

    return filtered;
  };

  const categoryIcons: Record<FoodCategory | 'ALL', string> = {
    ALL: '🌍',
    KOREAN: '🍚',
    CHINESE: '🥢',
    JAPANESE: '🍣',
    WESTERN: '🍝',
    ASIAN: '🍜',
    CAFE: '☕',
    ETC: '🍽️',
    DESSERT: '🍰',
  };

  if (loading) {
    return <Loading title='맛집 목록 로딩중...' />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    places && (
      <div className='p-4 md:p-8 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-gray-800'>맛집 목록</h1>

        {/* Search Controls */}
        <div className='mb-8 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg'>
          <div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
            <div className='flex items-center space-x-4 bg-gray-50 p-2 rounded-lg'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  checked={searchMethod === 'name'}
                  className='form-radio text-food-pink-400 focus:ring-food-pink-400'
                  name='searchMethod'
                  onChange={handleSearchMethodChange}
                  type='radio'
                  value='name'
                />
                <span className='text-gray-700'>이름으로 검색</span>
              </label>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  checked={searchMethod === 'category'}
                  className='form-radio text-food-pink-400 focus:ring-food-pink-400'
                  name='searchMethod'
                  onChange={handleSearchMethodChange}
                  type='radio'
                  value='category'
                />
                <span className='text-gray-700'>카테고리로 검색</span>
              </label>
            </div>

            {searchMethod === 'name' ? (
              <div className='flex-1'>
                <input
                  className='w-full p-3 rounded-lg border border-gray-200 focus:border-food-pink-300 focus:ring-2 focus:ring-food-pink-200 transition-all duration-300'
                  onChange={handleSearchChange}
                  placeholder='맛집 이름을 입력하세요...'
                  type='text'
                  value={searchQuery}
                />
              </div>
            ) : (
              <div className='flex-1'>
                <select
                  className='w-full p-3 rounded-lg border border-gray-200 focus:border-food-pink-300 focus:ring-2 focus:ring-food-pink-200 transition-all duration-300 appearance-none bg-white'
                  onChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  {categoryList.map(category => (
                    <option key={category.value} value={category.value}>
                      {categoryIcons[category.value]} {category.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Place List */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredPlaces().map(place => (
            <div
              className='bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full'
              key={place.placeId}
            >
              <div className='p-6 flex-1'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-800'>{place.placeName}</h2>
                  <span className='text-2xl'>{categoryIcons[place.category]}</span>
                </div>
                <p className='text-gray-600 line-clamp-3'>{place.placeDesc}</p>
              </div>
              <div className='p-6 pt-0 mt-auto'>
                <BaseButton
                  className='w-full bg-gradient-to-r from-food-pink-300 to-food-pink-400 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300'
                  onClick={() => handleMapViewClick(place.placeId)}
                >
                  지도에서 보기
                </BaseButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default FoodList;
