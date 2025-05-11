import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/auth');
  };

  return (
    <nav className="bg-blue-900 text-white fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
        <Link to="/" className="font-bold text-xl">TheOnlyGoodCameraStore</Link>
        <div className="flex space-x-4 items-center">
            <Link to="/about" className="text-white hover:text-gray-200 transition-colors px-4 py-2">
              About
            </Link>
            <Link to="/products" className="text-white hover:text-gray-200 transition-colors px-4 py-2">
              Products
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/orders" className="text-white hover:text-gray-200 transition-colors px-4 py-2">
                  Orders
                </Link>
                <Link to="/account" className="text-white hover:text-gray-200 transition-colors px-4 py-2">
                  My Account
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
