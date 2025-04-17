import { useSessionStore } from '@app/store';
import type { V1PlacePostRequest } from '@app/types/api';
import { categoryList } from '@app/types/api';
import type React from 'react';
import { useEffect, useState } from 'react';
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
  const { userInfo } = useSessionStore();

  // 로그인한 유저 정보가 없으면 alert 으로 알려주고 메인으로 팅겨내기
  useEffect(() => {
    if (!userInfo) {
      alert('로그인 후 사용해주세요.');
      window.location.href = '/';
    }
  }, [userInfo]);

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
        setCoordinates({ lat: Number.parseFloat(y), lng: Number.parseFloat(x) });
        setPlace({
          ...place,
          placeId: id,
          lat: Number.parseFloat(y),
          lng: Number.parseFloat(x),
        });
        setLookupDone(true); // Set lookup status to true
      } else {
        alert('장소를 찾을 수 없습니다. 이름을 최대한 정확하게 입력해주세요. ex) OOO 교대점');
        setLookupDone(false); // Set lookup status to false
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for missing fields
    if (!place.placeName || !place.lat || !place.lng || !place.placeId || !place.placeDesc || !place.category) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...place, userId: userInfo?.userId }),
      });

      if (response.ok) {
        alert('장소가 성공적으로 제보되었습니다.');
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
        alert('장소 제보에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error submitting place:', error);
      alert('장소 제보에 실패했습니다. 관리자에게 문의해주세요.');
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
              maxLength={20}
              name='placeName'
              onChange={handleUrlChange}
              required
              type='text'
              value={placeName}
            />
            <button
              className='bg-food-orange-300 text-white p-2 rounded hover:bg-food-orange-500 mt-2'
              onClick={handleAddressLookup}
              type='button'
            >
              조회하기
            </button>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>카테고리</label>
            <select
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              name='category'
              onChange={handleChange}
              required
              value={place.category}
            >
              {categoryList
                .filter(f => f.value !== 'ALL')
                .map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>설명</label>
            <textarea
              className='mt-1 block w-full p-2 border border-gray-300 rounded'
              maxLength={30}
              name='placeDesc'
              onChange={handleChange}
              required
              value={place.placeDesc}
            />
          </div>
          <button
            className='bg-food-orange-300 text-white p-2 rounded hover:bg-food-orange-500'
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
