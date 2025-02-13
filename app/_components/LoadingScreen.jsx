import { Spinner } from '@heroui/react';
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <Spinner size='lg' />
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
        <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch your data.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;