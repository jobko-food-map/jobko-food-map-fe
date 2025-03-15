import React, { useState } from 'react';
import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';

interface Place {
  lat: number;
  lng: number;
  title: string;
  placeId: number;
  description: string;
}

const mockData: Place[] = [
  {
    lat: 37.4955951,
    lng: 127.01373,
    title: '방이편백육분삼십 교대점',
    placeId: 1301035374,
    description: 'A popular restaurant in the area.',
  },
  {
    lat: 37.4915507,
    lng: 127.0127617,
    title: '다선칼국수 교대직영점',
    placeId: 145941801,
    description: 'Famous for its delicious noodles.',
  },
  {
    lat: 37.4913609,
    lng: 127.0120469,
    title: '송계옥 교대점',
    placeId: 1621224124,
    description: 'Known for its traditional Korean dishes.',
  },
];

function KakaoMap() {
  const [selectedPlace, setSelectedPlace] = useState<Place>();

  const handleMarkerClick = (data: Place) => {
    setSelectedPlace(data);
  };

  const handleCloseModal = () => {
    setSelectedPlace({
      lat: 0,
      lng: 0,
      title: '',
      placeId: 0,
      description: '',
    });
  };

  return (
    <>
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
        {mockData.map((data, index) => (
          <>
            <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
              <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid black' }}>{data.title}</div>
            </CustomOverlayMap>
            <MapMarker
              key={index}
              title={data.title}
              position={{
                lat: data.lat,
                lng: data.lng,
              }}
              onClick={() => handleMarkerClick(data)}
            />
          </>
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
    </>
  );
}

export default KakaoMap;
