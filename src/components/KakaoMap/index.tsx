import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import type { PlaceInfo, V1AllPlaceGetResponse } from '@app/types/api';
import { categoryList, type FoodCategory } from '@app/types/api/enum';

function KakaoMap() {
  const [places, setPlaces] = useState<V1AllPlaceGetResponse>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'ALL'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number } | null>(null);

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

  const handleMarkerClick = (data: PlaceInfo, marker: kakao.maps.Marker) => {
    setSelectedPlace(data);
    setHoveredPlaceId(null);

    // Get the position of the marker on the screen
    const target = marker.getPosition();
    target.getLat();
    target.getLng();
    // console.log(target)
    // const rect = target.getBoundingClientRect();
    // setCardPosition({
    //   top: rect.top + window.scrollY,
    //   left: rect.left + window.scrollX + 50, // Offset to the right of the marker
    // });
  };

  const handleMouseOver = (placeId: string) => {
    setHoveredPlaceId(placeId);
  };

  const handleMouseOut = () => {
    setHoveredPlaceId(null);
  };

  const handleCloseCard = () => {
    setSelectedPlace(null);
    setCardPosition(null);
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
        {categoryList.map((category) => (
          <button
            key={category.value}
            className={`bg-food-orange-300 text-white px-4 py-2 rounded-2xl hover:bg-food-orange-500 ${
              selectedCategory === category.value ? 'bg-food-orange-500' : ''
            }`}
            onClick={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
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
            {hoveredPlaceId === data.placeId && (
              <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
                <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid black' }}>
                  {data.placeName}
                </div>
              </CustomOverlayMap>
            )}
            <MapMarker
              title={data.placeName}
              image={{
                src: '/imgs/mark.png', // Path to the custom marker image
                size: {
                  width: 36,
                  height: 46,
                },
              }}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
              onClick={(marker) => handleMarkerClick(data, marker)}
              onMouseOut={handleMouseOut}
              onMouseOver={() => handleMouseOver(data.placeId)}
            />
          </React.Fragment>
        ))}
        {selectedPlace && (
          <CustomOverlayMap position={{ lat: selectedPlace.lat - 0.0001, lng: selectedPlace.lng - 0.0002 }}>
          <div className="absolute z-20 bg-white p-4 border border-gray-300 rounded shadow-lg" style={{ top: '20%', left: '70%' }}>
            <button className="absolute top-1 right-3 text-gray-500" onClick={() => setSelectedPlace(null)}>
              &times;
            </button>
            <h2 className="text-lg font-bold">{selectedPlace.placeName}</h2>
            <p className='mb-3'>{selectedPlace.placeDesc}</p>
            <a
              className="bg-food-pink-200 opacity-80 p-2 rounded text-white"
              href={`https://map.kakao.com/link/map/${selectedPlace.placeId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              지도에서 보기
            </a>
        </div>
        </CustomOverlayMap>)}
      </KaKaoMap>
    </div>
  );
}

export default KakaoMap;