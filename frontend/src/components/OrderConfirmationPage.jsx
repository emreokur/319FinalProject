import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder]       = useState(null);
  const [stockCounts, setStock] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    // 1. Load the order
    const loadOrder = async () => {
      setLoading(true);
      try {
        const user    = JSON.parse(localStorage.getItem('user') || '{}');
        const res     = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          headers: { 'UserId': user._id || user.email }
        });
        if (!res.ok) throw new Error(await res.text() || res.statusText);
        const ordJson = await res.json();
        setOrder(ordJson);

        // 2. Fetch current stock for each item
        const counts = {};
        await Promise.all(ordJson.items.map(async it => {
          const p = await fetch(`http://localhost:3000/api/products/${it.productId}`);
          if (p.ok) {
            const { product } = await p.json();
            counts[it.productId] = product.quantity;
          } else {
            counts[it.productId] = null;
          }
        }));
        setStock(counts);

      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-16 text-center">Loading your order…</div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="pt-16 p-8 text-center text-red-600">
        <p>Error loading order: {error}</p>
        <Link to="/orders" className="text-indigo-600 hover:underline">Back to My Orders</Link>
      </div>
      <Footer />
    </>
  );

  const placed = new Date(order.createdAt).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 pb-12">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-green-700 mb-4">Thank you for your order!</h1>
          <p>Your confirmation has been sent to <strong>{order.shipping.email}</strong>.</p>

          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span><span>#{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Placed on:</span><span>{placed}</span>
            </div>

            <h2 className="mt-4 font-semibold">Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((it, i) => (
                <li key={i} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="text-sm text-gray-600">Qty ordered: {it.quantity}</p>
                      {stockCounts[it.productId] != null && (
                        <p className="text-sm text-gray-600">
                          Remaining in stock: <strong>{stockCounts[it.productId]}</strong>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p>
                        {(
                          it.subtotal != null
                            ? it.subtotal
                            : it.price * it.quantity
                        ).toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'USD'
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span>
                {order.total.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD'
                })}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/orders"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View All My Orders
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
