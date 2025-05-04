import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-900 text-white fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="font-bold text-xl">TheOnlyGoodCameraStore</div>
          <div className="flex space-x-4 items-center">
            <Link to="/about" className="text-white hover:text-gray-200 transition-colors px-4 py-2">About</Link>
            <Link to="/auth/register" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
