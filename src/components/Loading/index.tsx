import React from 'react';

interface LoadingProps {
  title?: string; // Optional title prop
}

const Loading: React.FC<LoadingProps> = ({ title = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-white">{title}</p>
      </div>
    </div>
  );
};

export default Loading;