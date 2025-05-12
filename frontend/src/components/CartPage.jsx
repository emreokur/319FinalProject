import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// API Base URL
const BASE_URL = 'http://localhost:3000';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [stockLimits, setStockLimits] = useState({});
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      // Redirect to login if not authenticated
      navigate('/auth');
      return;
    }
    setUser(loggedInUser);

    // Fetch cart data
    fetchCart(loggedInUser);
  }, [navigate]);

  // Fetch stock information for all cart items
  const fetchStockInfo = async (items) => {
    try {
      const stockData = {};
      
      for (const item of items) {
        const response = await fetch(`${BASE_URL}/api/products/${item.productId}`);
        
        if (response.ok) {
          const data = await response.json();
          stockData[item.productId] = data.product?.quantity || 0;
        } else {
          console.error(`Failed to fetch stock for product ${item.productId}`);
          stockData[item.productId] = 0;
        }
      }
      
      setStockLimits(stockData);
      return stockData;
    } catch (err) {
      console.error('Error fetching stock info:', err);
      return {};
    }
  };

  const fetchCart = async (loggedInUser) => {
    setLoading(true);
    setError(null);
    
    const userId = loggedInUser._id || loggedInUser.id || loggedInUser.email;
    
    try {
      const response = await fetch(`${BASE_URL}/api/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const cartData = await response.json();
      
      const items = cartData.items || [];
      setCartItems(items);
      setTotal(cartData.total || 0);
      
      // Fetch stock information for all cart items
      if (items.length > 0) {
        fetchStockInfo(items);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1 || !user) return;
    
    if (stockLimits[productId] !== undefined && newQuantity > stockLimits[productId]) {
      setUpdateMessage({
        type: 'error',
        text: `Cannot add more items. Only ${stockLimits[productId]} in stock.`
      });
      
      setTimeout(() => setUpdateMessage(null), 3000);
      return;
    }
    
    const userId = user._id || user.id || user.email;
    
    try {
      setUpdateMessage(null);
      
      const response = await fetch(`${BASE_URL}/api/cart/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items || []);
      setTotal(updatedCart.total || 0);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (productId) => {
    if (!user) return;
    
    const userId = user._id || user.id || user.email;
    
    try {
      const response = await fetch(`${BASE_URL}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items || []);
      setTotal(updatedCart.total || 0);
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const calculateSubtotal = () => {
    return total;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.07; // 7% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* Add padding to push content below fixed navbar */}
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Shopping Cart</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {updateMessage && (
          <div className={`mb-6 p-4 rounded-md ${
            updateMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {updateMessage.text}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-4 text-gray-600">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-gray-600">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link 
              to="/products"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <li key={item.productId} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 sm:ml-6 flex flex-col">
                          <div className="flex justify-between">
                            <Link to={`/products/${item.productId}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                              {item.name}
                            </Link>
                            <button 
                              onClick={() => removeItem(item.productId)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2 flex-1">
                            {stockLimits[item.productId] !== undefined && (
                              <p className="text-sm">
                                {stockLimits[item.productId] > 0 
                                  ? `${stockLimits[item.productId]} in stock` 
                                  : <span className="text-red-500">Out of stock</span>}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-l-md hover:bg-gray-200"
                              >
                                -
                              </button>
                              <span className="bg-gray-50 px-4 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className={`bg-gray-100 text-gray-600 px-2 py-1 rounded-r-md hover:bg-gray-200 ${
                                  stockLimits[item.productId] !== undefined && 
                                  item.quantity >= stockLimits[item.productId] 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : ''
                                }`}
                                disabled={stockLimits[item.productId] !== undefined && item.quantity >= stockLimits[item.productId]}
                              >
                                +
                              </button>
                            </div>
                            <div className="font-bold text-indigo-700">
                              ${item.subtotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (7%)</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4"></div>
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-indigo-700">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mt-6"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage; 