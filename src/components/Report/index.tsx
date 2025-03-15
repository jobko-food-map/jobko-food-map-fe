import React, { useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';

interface Place {
  title: string;
  lat: number;
  lng: number;
  placeId: string;
  description: string;
  category: string;
}

function Report() {
  const [place, setPlace] = useState<Place>({
    title: '',
    lat: 0,
    lng: 0,
    placeId: '',
    description: '',
    category: '한식',
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
      title: e.target.value,
    });
    setLookupDone(false); // Reset lookup status when place name changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupDone) {
      alert('Please perform the lookup before submitting.');
      return;
    }
    console.log('Submitted place:', place);
    // Add your submission logic here
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
              <option value='한식'>한식</option>
              <option value='중식'>중식</option>
              <option value='일식'>일식</option>
              <option value='양식'>양식</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>설명</label>
            <textarea
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              name='description'
              value={place.description}
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
