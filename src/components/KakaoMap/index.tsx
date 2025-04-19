import type { PlaceInfo, V1AllPlaceGetResponse } from '@app/types/api';
import type { FoodCategory } from '@app/types/api/enum';
import { categoryList } from '@app/types/api/enum';
import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import BaseButton from '../BaseButton';
import Loading from '../Loading';

function KakaoMap() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
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

  const handleMarkerClick = (data: PlaceInfo) => {
    setSelectedPlace(data);
    setHoveredPlaceId(null);
  };

  const handleMouseOver = (placeId: string) => {
    setHoveredPlaceId(placeId);
  };

  const handleMouseOut = () => {
    setHoveredPlaceId(null);
  };

  const handleCloseCard = () => {
    setSelectedPlace(null);
  };

  const handleCategoryChange = (category: FoodCategory | 'ALL') => {
    setSelectedCategory(category);
  };

  const filteredData =
    selectedCategory === 'ALL' ? places?.content : places?.content.filter(place => place.category === selectedCategory);

  if (loading) {
    return <Loading title='점메추 지도 로딩중...' />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const categoryIcons: Record<FoodCategory | 'ALL', string> = {
    ALL: '🌍',
    KOREAN: '🍚',
    CHINESE: '🥢',
    JAPANESE: '🍣',
    WESTERN: '🍝',
    ASIAN: '🍜',
    DESSERT: '🍰',
  };

  return (
    places && (
      <div className='relative'>
        {/* Category Filter */}
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg whitespace-nowrap overflow-x-auto max-w-[90vw]'>
          {categoryList.map(category => (
            <BaseButton
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-food-pink-300 to-food-pink-400 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
            >
              <span className='text-lg'>{categoryIcons[category.value]}</span>
              <span>{category.label}</span>
            </BaseButton>
          ))}
        </div>

        {/* Map */}
        <KaKaoMap
          center={{
            lat: 37.4941971,
            lng: 127.0144358,
          }}
          id='map'
          level={3}
          style={{
            width: '100%',
            height: '700px',
          }}
        >
          {filteredData?.map(data => (
            <React.Fragment key={data.placeId}>
              {/* Hover Info Window */}
              {hoveredPlaceId === data.placeId && (
                <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
                  <div className='bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 transform -translate-y-2 transition-all duration-300'>
                    <p className='text-sm font-medium text-gray-800'>{data.placeName}</p>
                  </div>
                </CustomOverlayMap>
              )}

              {/* Marker */}
              <MapMarker
                image={{
                  src: '/imgs/mark.png',
                  size: {
                    width: 36,
                    height: 46,
                  },
                }}
                onClick={() => handleMarkerClick(data)}
                onMouseOut={handleMouseOut}
                onMouseOver={() => handleMouseOver(data.placeId)}
                position={{
                  lat: data.lat,
                  lng: data.lng,
                }}
                title={data.placeName}
              />
            </React.Fragment>
          ))}

          {/* Selected Place Info Window */}
          {selectedPlace && (
            <CustomOverlayMap position={{ lat: selectedPlace.lat - 0.0001, lng: selectedPlace.lng - 0.0002 }}>
              <div className='bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-gray-100 transform transition-all duration-300 w-80'>
                <button
                  className='absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  onClick={handleCloseCard}
                  type='button'
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path d='M6 18L18 6M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
                  </svg>
                </button>
                <h2 className='text-xl font-bold text-gray-800 mb-2'>{selectedPlace.placeName}</h2>
                <p className='text-gray-600 mb-4'>{selectedPlace.placeDesc}</p>
                <a
                  className='inline-block bg-gradient-to-r from-food-pink-300 to-food-pink-400 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300'
                  href={`https://map.kakao.com/link/map/${selectedPlace.placeId}`}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  지도에서 보기
                </a>
              </div>
            </CustomOverlayMap>
          )}
        </KaKaoMap>
      </div>
    )
  );
}

export default KakaoMap;
