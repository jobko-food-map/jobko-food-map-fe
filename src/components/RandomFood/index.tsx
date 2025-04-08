import React, { useEffect, useState } from 'react';

interface Food {
  id: number;
  name: string;
  description: string;
}

function RandomFood() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // Simulate fetching food data
    const fetchFoods = async () => {
      const response = await fetch('https://quick-maudie-foodmap-c9af4ec2.koyeb.app/v1/all/place?pageNo=0&pageSize=100&isApprove=true');
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

  const handleRandomSelect = () => {
    if (foods.length === 0) return;

    setIsSpinning(true);
    setSelectedFood(null);

    // Simulate spinning for 3 seconds
    const spinDuration = 3000;
    const interval = 100; // Interval for changing the displayed food
    let elapsedTime = 0;

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * foods.length);
      setSelectedFood(foods[randomIndex]);
      elapsedTime += interval;

      if (elapsedTime >= spinDuration) {
        clearInterval(spinInterval);
        setIsSpinning(false);
      }
    }, interval);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">랜덤 음식 추천</h1>
      <div className="relative w-64 h-32 border border-gray-300 rounded overflow-hidden bg-white flex items-center justify-center">
        {isSpinning ? (
          <div className="animate-slide text-lg font-semibold">{selectedFood?.name || '...'}</div>
        ) : selectedFood ? (
          <div className="text-lg font-semibold">
            <h2>{selectedFood.name}</h2>
            <p className="text-sm text-gray-500">{selectedFood.description}</p>
          </div>
        ) : (
          <p className="text-gray-500">음식을 추천받으려면 버튼을 눌러주세요.</p>
        )}
      </div>
      <button
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={isSpinning}
        onClick={handleRandomSelect}
      >
        랜덤추천
      </button>
    </div>
  );
}

export default RandomFood;