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
    <div className='flex flex-col items-center justify-center h-full bg-gray-100'>
      <h1 className='text-2xl font-bold mb-6'>랜덤 음식 추천</h1>
      <p className='text-sm text-gray-500 mb-4'>레버를 당겨서 등록된 맛집 중 랜덤으로 음식을 추천받아보세요!</p>
      <div className='relative w-64 h-32 border border-gray-300 rounded overflow-hidden bg-white'>
        <div
          className='absolute w-full h-full transition-transform duration-100 ease-linear'
          style={{
            transform: `translateY(-${slotIndex * 100}%)`,
          }}
        >
          {foods.map(food => (
            <div className='w-full h-32 flex items-center justify-center border-b border-gray-200' key={food.id}>
              <h2 className='text-lg font-bold'>{food.name}</h2>
            </div>
          ))}
        </div>
      </div>
      <BaseButton
        className='mt-6 bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transform active:translate-y-1'
        disabled={isSpinning}
        onClick={handleSpin}
      >
        레버 당기기 🎰
      </BaseButton>
      {selectedFood && (
        <div className='mt-6 text-center'>
          <h2 className='text-lg font-bold'>{selectedFood.name}</h2>
          <p className='text-sm text-gray-500'>{selectedFood.description}</p>
        </div>
      )}
    </div>
  );
}

export default RandomFood;
