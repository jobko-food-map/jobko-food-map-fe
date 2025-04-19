import { useSessionStore } from '@app/store';
import type { V1PlacePostRequest } from '@app/types/api';
import { categoryList } from '@app/types/api';
import type React from 'react';
import { useRef, useState } from 'react';
import { Map as KaKaoMap, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router';

function Report() {
  const [place, setPlace] = useState<V1PlacePostRequest>({
    placeName: '',
    lat: 0,
    lng: 0,
    placeId: '',
    placeDesc: '',
    category: 'KOREAN',
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 37.4936,
    lng: 127.0141,
  });
  const [placeName, setPlaceName] = useState<string>('');
  const [lookupDone, setLookupDone] = useState<boolean>(false);
  const { userInfo } = useSessionStore();
  const navigate = useNavigate();
  const alertShown = useRef(false);

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

    if (!userInfo) {
      alert('로그인 후 제보해주세요.');
      return;
    }

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
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='p-6 sm:p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-8'>새로운 장소 제보하기</h1>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <div>
                <form className='space-y-6' onSubmit={handleSubmit}>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>장소명</label>
                    <div className='flex gap-2'>
                      <input
                        className='flex-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-food-orange-300 focus:border-food-orange-300'
                        maxLength={20}
                        name='placeName'
                        onChange={handleUrlChange}
                        placeholder='장소명을 입력해주세요'
                        required
                        type='text'
                        value={placeName}
                      />
                      <button
                        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-food-orange-300 hover:bg-food-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-food-orange-300'
                        onClick={handleAddressLookup}
                        type='button'
                      >
                        조회하기
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>카테고리</label>
                    <div className='relative'>
                      <select
                        className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-food-orange-300 focus:border-food-orange-300 appearance-none'
                        name='category'
                        onChange={handleChange}
                        required
                        value={place.category}
                      >
                        {categoryList
                          .filter(f => f.value !== 'ALL')
                          .map(category => (
                            <option key={category.value} value={category.value}>
                              {category.value === 'KOREAN' && '🍚 '}
                              {category.value === 'CHINESE' && '🥢 '}
                              {category.value === 'JAPANESE' && '🍣 '}
                              {category.value === 'WESTERN' && '🍝 '}
                              {category.value === 'ASIAN' && '🍜 '}
                              {category.value === 'DESSERT' && '🍰 '}
                              {category.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>설명</label>
                    <textarea
                      className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-food-orange-300 focus:border-food-orange-300'
                      maxLength={30}
                      name='placeDesc'
                      onChange={handleChange}
                      placeholder='장소에 대한 설명을 입력해주세요'
                      required
                      rows={3}
                      value={place.placeDesc}
                    />
                  </div>

                  <button
                    className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-food-orange-300 hover:bg-food-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-food-orange-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={!lookupDone}
                    type='submit'
                  >
                    제출하기
                  </button>
                </form>
              </div>

              {coordinates && (
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h2 className='text-lg font-medium text-gray-900 mb-4'>위치 미리보기</h2>
                  <div className='rounded-lg overflow-hidden shadow-md'>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
