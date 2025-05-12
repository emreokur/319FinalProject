import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // adjust path as needed

// API Base URL
const BASE_URL = 'http://localhost:3000';

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Real cart loaded from backend
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Form / submission state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Fetch current user's cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user) throw new Error('Not authenticated');
        const userId = user._id || user.id || user.email;

        const res = await fetch(`${BASE_URL}/api/cart`, {
          headers: { 'UserId': userId }
        });
        if (!res.ok) throw new Error('Failed to load cart');
        const { items, total } = await res.json();
        setCartItems(items);
        setCartTotal(total);
      } catch (e) {
        setLoadError(e.message);
      }
    };
    loadCart();
  }, []);

  // Helpers for totals
  const calcTax = () => cartTotal * 0.07;
  const calcShipping = () => cartTotal > 1000 ? 0 : 15.99;
  const calcGrandTotal = () => cartTotal + calcTax() + calcShipping();

  // Controlled inputs
  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) {
      setFormErrors(f => ({ ...f, [e.target.name]: null }));
    }
  };

  // Simple validation
  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid';
    if (!formData.address) errs.address = 'Required';
    ['city','state','zipCode'].forEach(field => {
      if (!formData[field].trim()) errs[field] = 'Required';
    });
    if (!formData.cardName.trim()) errs.cardName = 'Required';
    if (formData.cardNumber.replace(/\s+/g,'').length !== 16) errs.cardNumber = 'Must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) errs.expiryDate = 'MM/YY';
    if (!/^\d{3,4}$/.test(formData.cvv)) errs.cvv = '3 or 4 digits';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id || user.email;

      // Build payload
      const payload = {
        fullName:     formData.fullName,
        email:        formData.email,
        address:      formData.address,
        city:         formData.city,
        state:        formData.state,
        zipCode:      formData.zipCode,
        country:      formData.country,
        items:        cartItems.map(i => ({
          productId: i.productId,
          name:      i.name,
          price:     i.price,
          quantity:  i.quantity,
          subtotal:  i.quantity * i.price,
          image:     i.image
        })),
        subtotal:     cartTotal,
        tax:          calcTax(),
        shippingCost: calcShipping(),
        total:        calcGrandTotal()
      };

      // 1) Create order
      const orderRes = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'UserId': userId
        },
        body: JSON.stringify(payload)
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderJson.message || 'Order failed');

      // 2) Clear cart
      await fetch(`${BASE_URL}/api/cart`, {
        method: 'DELETE',
        headers: { 'UserId': userId }
      });

      // 3) Navigate
      navigate(`/order/confirmation/${orderJson.orderId}`);
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || 'Error placing order');
    }
  };

  if (loadError) {
    return (
      <>
        <Navbar />
        <div className="pt-16 p-8 text-red-600">Error loading cart: {loadError}</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold">Checkout</h1>

          {/* Shipping & Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white p-6 rounded shadow">
              <h2 className="mb-4 font-semibold">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['fullName','Full Name'],
                  ['email','Email'],
                  ['address','Street Address']
                ].map(([key,label]) => (
                  <div key={key} className="col-span-2">
                    <label className="block text-sm mb-1">{label}</label>
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded ${
                        formErrors[key] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors[key] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[key]}</p>
                    )}
                  </div>
                ))}

                {['city','state','zipCode'].map(field => (
                  <div key={field}>
                    <label className="block text-sm mb-1">
                      {field.charAt(0).toUpperCase()+field.slice(1)}
                    </label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded ${
                        formErrors[field] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-sm mb-1">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded border-gray-300"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded shadow">
              <h2 className="mb-4 font-semibold">Payment Information</h2>
              <div className="space-y-4">
                {[
                  ['cardName','Name on Card'],
                  ['cardNumber','Card Number'],
                  ['expiryDate','Expiry Date (MM/YY)'],
                  ['cvv','CVV']
                ].map(([key,label]) => (
                  <div key={key}>
                    <label className="block text-sm mb-1">{label}</label>
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded ${
                        formErrors[key] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors[key] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[key]}</p>
                    )}
                  </div>
                ))}
                <p className="text-gray-500 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" 
                       viewBox="0 0 24 24"><path strokeLinecap="round" 
                       strokeLinejoin="round" strokeWidth={2} 
                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 
                       00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 
                       2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  All transactions are secure and encrypted.
                </p>
              </div>
            </section>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white rounded ${
                isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Processing…' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="bg-white p-6 rounded shadow space-y-4 sticky top-20">
          <h2 className="font-semibold">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.productId} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (7%)</span>
            <span>${calcTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{calcShipping() === 0 ? 'Free' : `$${calcShipping().toFixed(2)}`}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${calcGrandTotal().toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
