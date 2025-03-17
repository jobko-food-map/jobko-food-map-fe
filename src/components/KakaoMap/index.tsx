import React, { useState } from 'react';
import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';

interface Place {
  lat: number;
  lng: number;
  title: string;
  placeId: number;
  description: string;
  category: string;
}

const mockData: Place[] = [
  {
    lat: 37.4955951,
    lng: 127.01373,
    title: '방이편백육분삼십 교대점',
    placeId: 1301035374,
    description: 'A popular restaurant in the area.',
    category: '한식',
  },
  {
    lat: 37.4915507,
    lng: 127.0127617,
    title: '다선칼국수 교대직영점',
    placeId: 145941801,
    description: 'Famous for its delicious noodles.',
    category: '한식',
  },
  {
    lat: 37.4913609,
    lng: 127.0120469,
    title: '송계옥 교대점',
    placeId: 1621224124,
    description: 'Known for its traditional Korean dishes.',
    category: '한식',
  },
  {
    lat: 37.4923609,
    lng: 127.0130469,
    title: '중국집 교대점',
    placeId: 1621224125,
    description: 'Known for its traditional Chinese dishes.',
    category: '중식',
  },
];

function KakaoMap() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const handleMarkerClick = (data: Place) => {
    setSelectedPlace(data);
  };

  const handleCloseModal = () => {
    setSelectedPlace(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredData = selectedCategory === '전체' ? mockData : mockData.filter((place) => place.category === selectedCategory);

  return (
    <div className="relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600" onClick={() => handleCategoryChange('전체')}>전체</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600" onClick={() => handleCategoryChange('한식')}>한식</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600" onClick={() => handleCategoryChange('중식')}>중식</button>
        {/* Add more category buttons as needed */}
      </div>
      <KaKaoMap
        id='map'
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
        {filteredData.map((data, index) => (
          <React.Fragment key={index}>
            <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
              <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid black' }}>{data.title}</div>
            </CustomOverlayMap>
            <MapMarker
              title={data.title}
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
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={handleCloseModal}>
              &times;
            </span>
            <h2>{selectedPlace.title}</h2>
            <p>{selectedPlace.description}</p>
            <a
              href={`https://map.kakao.com/link/map/${selectedPlace.placeId}`}
              rel='noopener noreferrer'
              target='_blank'
            >
              View on Kakao Map
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default KakaoMap;