import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const str = localStorage.getItem('user');
    if (str) {
      try {
        const user = JSON.parse(str);
        setIsLoggedIn(true);
        setIsAdmin(user?.role === 'admin');
      } catch (err) {
        console.error('Bad user JSON:', err);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/auth');
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-10 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-bold">
            TheOnlyGoodCameraStore
          </Link>

          <div className="flex items-center space-x-4">

            {!isAdmin && (
              <>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/products" className="nav-link">Products</Link>
                <Link to="/cart" className="nav-link">Cart</Link>
              </>
            )}

            {isLoggedIn && !isAdmin && (
              <Link to="/orders" className="nav-link">Orders</Link>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className="nav-link">Admin&nbsp;Dashboard</Link>
                <Link to="/analytics" className="nav-link">Analytics</Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link to="/account" className="nav-link">My&nbsp;Account</Link>
                <button
                  onClick={handleLogout}
                  className="rounded bg-red-600 px-4 py-2 hover:bg-red-500"
                >
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <Link
                to="/auth"
                className="rounded bg-indigo-700 px-4 py-2 hover:bg-indigo-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="nav-link"
    >
      {children}
    </Link>
  );
}
