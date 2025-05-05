import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-bold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 