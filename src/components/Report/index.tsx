import type { V1PlacePostRequest } from '@app/types/api';
import React, { useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';

function Report() {
  const [place, setPlace] = useState<V1PlacePostRequest>({
    placeName: '',
    lat: 0,
    lng: 0,
    placeId: '',
    placeDesc: '',
    category: 'KOREAN',
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [placeName, setPlaceName] = useState<string>('');
  const [lookupDone, setLookupDone] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlace({
      ...place,
      [name]: value,
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceName(e.target.value);
    setPlace({
      ...place,
      placeName: e.target.value,
    });
    setLookupDone(false); // Reset lookup status when place name changes
  };

  const handleAddressLookup = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(placeName, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const { id, x, y } = result[0];
        setCoordinates({ lat: parseFloat(y), lng: parseFloat(x) });
        setPlace({
          ...place,
          placeId: id,
          lat: parseFloat(y),
          lng: parseFloat(x),
        });
        setLookupDone(true); // Set lookup status to true
      } else {
        alert('Address not found');
        setLookupDone(false); // Set lookup status to false
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing fields
    if (!place.placeName || !place.lat || !place.lng || !place.placeId || !place.placeDesc || !place.category) {
      alert('All fields must be filled out.');
      return;
    }

    try {
      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(place),
      });

      if (response.ok) {
        alert('Place submitted successfully!');
        // Reset form after successful submission
        setPlace({
          placeName: '',
          lat: 0,
          lng: 0,
          placeId: '',
          placeDesc: '',
          category: 'KOREAN',
        });
        setPlaceName('');
        setCoordinates(null);
        setLookupDone(false);
      } else {
        alert('Failed to submit place.');
      }
    } catch (error) {
      console.error('Error submitting place:', error);
      alert('An error occurred while submitting the place.');
    }
  };

  return (
    <div className='p-4 flex'>
      <div className='w-1/2 pr-4'>
        <h1 className='text-2xl font-bold mb-4'>새로운 장소 제보하기</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>장소명</label>
            <input
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              name='placeName'
              type='text'
              value={placeName}
              required
              onChange={handleUrlChange}
            />
            <button
              className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2'
              type='button'
              onClick={handleAddressLookup}
            >
              조회하기
            </button>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>카테고리</label>
            <select
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              name='category'
              value={place.category}
              required
              onChange={handleChange}
            >
              <option value='KOREAN'>한식</option>
              <option value='CHINESE'>중식</option>
              <option value='JAPANESE'>일식</option>
              <option value='WESTERN'>양식</option>
              <option value='DESSERT'>디저트</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>설명</label>
            <textarea
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              name='placeDesc'
              value={place.placeDesc}
              required
              onChange={handleChange}
            />
          </div>
          <button
            className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
            disabled={!lookupDone} // Disable submit button if lookup is not done
            type='submit'
          >
            제출하기
          </button>
        </form>
      </div>
      {coordinates && (
        <div className='w-1/2 pl-4'>
          <h2 className='text-xl font-bold mb-2'>Preview</h2>
          <KaKaoMap
            center={coordinates}
            level={3}
            style={{
              width: '100%',
              height: '400px',
            }}
          >
            <MapMarker position={coordinates} />
          </KaKaoMap>
        </div>
      )}
    </div>
  );
}

export default Report;
