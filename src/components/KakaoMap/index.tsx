import type { PlaceInfo, V1AllPlaceGetResponse } from '@app/types/api';
import type { FoodCategory } from '@app/types/api/enum';
import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import BaseLink from '../BaseLink';

function KakaoMap() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo>();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          'https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?pageNo=0&pageSize=100&isApprove=true'
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
  };

  const handleCloseModal = () => {
    setSelectedPlace(undefined);
  };

  const handleCategoryChange = (category: FoodCategory | 'ALL') => {
    setSelectedCategory(category);
  };

  const filteredData =
    selectedCategory === 'ALL'
      ? places?.content
      : places?.content.filter((place) => place.category === selectedCategory);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return places && (
    <div className="relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('ALL')}
        >
          전체
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('KOREAN')}
        >
          한식
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('CHINESE')}
        >
          중식
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('JAPANESE')}
        >
          일식
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('WESTERN')}
        >
          양식
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
          onClick={() => handleCategoryChange('DESSERT')}
        >
          디저트
        </button>
      </div>
      <KaKaoMap
        id="map"
        level={3}
        center={{
          lat: 37.4941971,
          lng: 127.0144358,
        }}
        style={{
          width: '100%',
          height: '700px',
        }}
      >
        {filteredData?.map((data) => (
          <React.Fragment key={data.placeId}>
            <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
              <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid black' }}>
                {data.placeName}
              </div>
            </CustomOverlayMap>
            <MapMarker
              title={data.placeName}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
              onClick={() => handleMarkerClick(data)}
            />
          </React.Fragment>
        ))}
      </KaKaoMap>
      {selectedPlace && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>{selectedPlace.placeName}</h2>
            <p>{selectedPlace.placeDesc}</p>
            <BaseLink
              rel="noopener noreferrer"
              target="_blank"
              to={`https://map.kakao.com/link/map/${selectedPlace.placeId}`}
            >
              View on Kakao Map
            </BaseLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default KakaoMap;