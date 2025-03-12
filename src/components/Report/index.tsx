import React, { useState } from 'react';

interface Place {
  lat: number;
  lng: number;
  title: string;
  placeId: number;
  description: string;
}

function Report() {
  const [place, setPlace] = useState<Place>({
    lat: 0,
    lng: 0,
    title: '',
    placeId: 0,
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlace({
      ...place,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted place:', place);
    // Add your submission logic here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Report a New Place</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Latitude</label>
          <input
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            name="lat"
            type="number"
            value={place.lat}
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Longitude</label>
          <input
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            name="lng"
            type="number"
            value={place.lng}
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            name="title"
            type="text"
            value={place.title}
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Place ID</label>
          <input
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            name="placeId"
            type="number"
            value={place.placeId}
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            name="description"
            value={place.description}
            required
            onChange={handleChange}
          />
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Report;