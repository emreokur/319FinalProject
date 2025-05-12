import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function AdminEmailPage() {
  const nav = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  useEffect(() => {
    if (user.role !== 'admin') nav('/products');
  }, [user, nav]);

  const [form, setForm] = useState({ to: '', subject: '', html: '' });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);        

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:3000/api/email', {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
          UserId  : user._id || user.email,
          UserRole: 'admin'
        },
        body: JSON.stringify({
          to     : form.to.split(',').map(s => s.trim()).filter(Boolean),
          subject: form.subject,
          html   : form.html
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      setMessage({ type:'success', text:`Sent!` });
      setForm({ to:'', subject:'', html:'' });
    } catch (err) {
      setMessage({ type:'error', text: err.message || 'Failed to send' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-3xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold mb-6">Send E‑mail</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-md border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50   border-red-200   text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">
              Recipient(s) – comma‑separated
            </label>
            <input
              type="text"
              id="to"
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder="customer@example.com, other@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder="Great news from TheGoodCameraStore!"
            />
          </div>

          <div>
            <label htmlFor="html" className="block text-sm font-medium text-gray-700">
              Body (HTML allowed)
            </label>
            <textarea
              id="html"
              name="html"
              rows="8"
              value={form.html}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 font-mono"
              placeholder="<p>Hello customer – thanks for your purchase …</p>"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={sending}
              className={`bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition ${
                sending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {sending ? 'Sending…' : 'Send E‑mail'}
            </button>

            <Link to="/admin" className="text-indigo-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
