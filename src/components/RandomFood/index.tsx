import { useEffect, useState } from 'react';
import BaseButton from '../BaseButton';

interface Food {
  id: number;
  name: string;
  description: string;
}

function RandomFood() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [slotIndex, setSlotIndex] = useState(0); // Tracks the current index of the slot

  useEffect(() => {
    // Simulate fetching food data
    const fetchFoods = async () => {
      const response = await fetch(
        'https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?pageNo=0&pageSize=100&isApprove=true',
      );
      const data = await response.json();
      const foodList = data.content.map((item: any) => ({
        id: item.id,
        name: item.placeName,
        description: item.placeDesc,
      }));
      setFoods(foodList);
    };

    fetchFoods();
  }, []);

  const handleSpin = () => {
    if (foods.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedFood(null);

    const spinDuration = 2000; // Total spin duration in milliseconds
    const interval = 100; // Interval for changing the slot index
    let elapsedTime = 0;

    const spinInterval = setInterval(() => {
      setSlotIndex(prevIndex => (prevIndex + 1) % foods.length); // Cycle through the foods
      elapsedTime += interval;

      if (elapsedTime >= spinDuration) {
        clearInterval(spinInterval);
        const randomIndex = Math.floor(Math.random() * foods.length);
        setSlotIndex(randomIndex); // Stop at a random food
        setSelectedFood(foods[randomIndex]);
        setIsSpinning(false);
      }
    }, interval);
  };

  return (
    <div className='flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-white p-4'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>랜덤 음식 추천</h1>
          <p className='text-gray-600 mt-2'>레버를 당겨서 점메추 등록된 맛집 중 랜덤으로 음식을 추천받아보세요!</p>
        </div>

        <div className='relative w-full h-48 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div
            className='absolute w-full h-full transition-transform duration-100 ease-linear'
            style={{
              transform: `translateY(-${slotIndex * 100}%)`,
            }}
          >
            {foods.map(food => (
              <div className='w-full h-48 flex items-center justify-center border-b border-gray-100' key={food.id}>
                <h2 className='text-2xl font-bold text-gray-800'>{food.name}</h2>
              </div>
            ))}
          </div>
        </div>

        <BaseButton
          className='w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-4 rounded-xl hover:from-orange-500 hover:to-orange-600 transform active:scale-95 transition-all duration-200 shadow-lg'
          disabled={isSpinning}
          onClick={handleSpin}
        >
          <span className='flex items-center justify-center gap-2'>
            레버 당기기
            <span className='text-xl'>🎰</span>
          </span>
        </BaseButton>

        {selectedFood && (
          <div className='mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>{selectedFood.name}</h2>
            <p className='text-gray-600'>{selectedFood.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RandomFood;
