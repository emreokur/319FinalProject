import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function OrderManagementPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const res  = await fetch('http://localhost:3000/api/orders', {
          headers: { 'UserId': user._id || user.email }
        });
        if (!res.ok) throw new Error(await res.text() || res.statusText);
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res  = await fetch(
        `http://localhost:3000/api/orders/${orderId}/cancel`,
        { method: 'PATCH', headers: { 'UserId': user._id || user.email } }
      );
      if (!res.ok) throw new Error(await res.text());
      // update UI
      setOrders(orders.map(o =>
        o._id === orderId
          ? { ...o, status: { ...o.status, cancelled: { completed: true } } }
          : o
      ));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReturn = async (orderId) => {
    if (!window.confirm('Request a return for this order?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res  = await fetch(
        `http://localhost:3000/api/orders/${orderId}/return`,
        { method: 'PATCH', headers: { 'UserId': user._id || user.email } }
      );
      if (!res.ok) throw new Error(await res.text());
      setOrders(orders.map(o =>
        o._id === orderId
          ? { ...o, status: { ...o.status, return_requested: { requested: true } } }
          : o
      ));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className="p-6">Loading your orders…</p>;
  if (error)   return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen pt-24 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {orders.length === 0 && (
            <p className="text-center text-gray-600">You haven’t placed any orders yet.</p>
          )}

          {orders.map(order => {
            const packed   = order.status.packed.completed;
            const shipped  = order.status.shipped.completed;
            const cancelled= order.status.cancelled?.completed;
            const returned = order.status.return_requested?.requested;

            return (
              <div key={order._id} className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block text-sm px-2 py-1 rounded-full mb-2"
                      style={{
                        background: cancelled
                          ? '#FEE2E2'
                          : returned
                            ? '#FEF3C7'
                            : shipped
                              ? '#DBEAFE'
                              : '#E0F2FE',
                        color: cancelled
                          ? '#B91C1C'
                          : returned
                            ? '#92400E'
                            : shipped
                              ? '#1E40AF'
                              : '#0369A1'
                      }}
                    >
                      {cancelled
                        ? 'Cancelled'
                        : returned
                          ? 'Return Requested'
                          : shipped
                            ? 'Shipped'
                            : 'Processing'}
                    </span>
                    <p className="text-xl font-bold text-gray-800">
                      {(order.total).toLocaleString(undefined,{
                        style:'currency',currency:'USD'
                      })}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {order.items.map((it,i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {it.quantity} × {(it.price).toLocaleString(undefined,{
                            style:'currency',currency:'USD'
                          })}
                        </p>
                      </div>
                      <div className="font-medium">
                        {(it.subtotal ?? it.price * it.quantity).toLocaleString(undefined,{
                          style:'currency',currency:'USD'
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  {/* Cancel if not packed yet and not already cancelled */}
                  {!packed && !cancelled && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}


                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
