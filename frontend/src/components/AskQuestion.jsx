import React, { useState } from 'react';

export default function AskQuestion() {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
const [status, setStatus] = useState('idle');

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
        const res = await fetch('http://localhost:3000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, question })
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setEmail('');
      setQuestion('');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Have a Question?</h2>
      <form 
        onSubmit={handleSubmit} 
        className="max-w-xl mx-auto space-y-6 bg-gray-50 p-8 rounded-lg shadow-md"
      >
        <div>
          <label htmlFor="ask-email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            id="ask-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          />
        </div>
        <div>
          <label htmlFor="ask-question" className="block text-sm font-medium text-gray-700">
            Your Question
          </label>
          <textarea
            id="ask-question"
            required
            rows={4}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md 
                     hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {status === 'loading' ? 'Sending…' : 'Submit Question'}
        </button>
        {status === 'success' && (
          <p className="text-green-600 text-center">Thanks! We’ll get back to you soon.</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-center">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}
