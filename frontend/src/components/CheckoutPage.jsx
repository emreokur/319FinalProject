import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// Mock cart items (same as CartPage)
const MOCK_CART_ITEMS = [
  {
    id: "1",
    productId: "1",
    name: "Professional DSLR Camera",
    price: 1499.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    seller: "Premium Camera Shop"
  }
];

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems] = useState(MOCK_CART_ITEMS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    // Payment info
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.07; // 7% tax rate
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 1000 ? 0 : 15.99; // Free shipping over $1000
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Shipping info validation
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    
    // Payment info validation
    if (!formData.cardName.trim()) errors.cardName = 'Name on card is required';
    if (!formData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Card number should be 16 digits';
    }
    if (!formData.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = 'Please use format MM/YY';
    }
    if (!formData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = 'CVV should be 3 or 4 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to create an order
      // For now, we'll simulate a delay and then redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random order ID for demo purposes
      const orderId = Math.random().toString(36).substring(2, 10);
      
      // Redirect to order confirmation page
      navigate(`/order/confirmation/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      {/* Add padding to push content below fixed navbar */}
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
          {/* Shipping and Payment Forms */}
          <div className="md:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div className="col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.fullName}</p>}
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.email}</p>}
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.address && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.city && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.state && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.state}</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.zipCode && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.zipCode}</p>}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.cardName && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.cardName}</p>}
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.cardNumber}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.expiryDate && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.expiryDate}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.cvv && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.cvv}</p>}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="ml-2 text-sm text-gray-500">All transactions are secure and encrypted.</span>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between pb-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-base font-bold text-indigo-700">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage; 