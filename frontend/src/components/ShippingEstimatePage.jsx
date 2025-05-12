import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

export default function ShippingEstimatePage () {
  const nav  = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')||'{}');
  if (user.role !== 'admin') nav('/products');

  const [form, setForm]   = useState({ fromZip:'60031', toZip:'90210', weight:'1' });
  const [quotes, setQ]    = useState(null);
  const [loading, setL]   = useState(false);
  const [error,  setErr ] = useState(null);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function fetchQuote (e) {
    e.preventDefault();
    setL(true); setErr(null); setQ(null);
    try {
      const res = await fetch('http://localhost:3000/api/shipping/estimate',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          UserId  : user._id||user.email,
          UserRole: 'admin'
        },
        body: JSON.stringify({
          fromZip : form.fromZip,
          toZip   : form.toZip,
          weightLb: +form.weight
        })
      });
      if(!res.ok) throw new Error(await res.text());
      const { rates } = await res.json();
      setQ(rates);
    }catch(e){ setErr(e.message) }
    finally   { setL(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-xl mx-auto p-8 space-y-8">

        <h1 className="text-2xl font-bold mb-4">Shipping Estimate</h1>

        <form onSubmit={fetchQuote} className="space-y-4 bg-white p-6 rounded-lg shadow">
          {['fromZip','toZip','weight'].map((f,i)=>(
            <div key={i}>
              <label className="block text-sm font-medium mb-1 capitalize">{f === 'weight' ? 'Weight (lb)' : f}</label>
              <input
                name={f}
                value={form[f]}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          ))}
          <button
            disabled={loading}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {loading? 'Fetching…' : 'Get Rates'}
          </button>
        </form>

        {error && <p className="text-red-600">{error}</p>}

        {quotes && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Quotes</h2>
            <ul className="space-y-2">
              {quotes.map(q=>(
                <li key={q.service} className="flex justify-between">
                  <span>{q.service}</span>
                  <span className="font-medium">${q.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
