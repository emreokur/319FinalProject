import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
// import { fetchOrderById } from './services/orderService'; // Backend call (commented out)
import { useParams } from 'react-router-dom';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockOrder = {
    id: orderId || 'cm96i27w',
    date: '4/6/2025',
    customerName: 'John Pork',
    customerEmail: 'jp@email.com',
    total: 1499.99,
    items: [
      {
        name: 'Professional DSLR Camera',
        quantity: 1,
        price: 1499.99,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      // const data = await fetchOrderById(orderId);
      const data = mockOrder;
      setOrder(data);
      setLoading(false);
    };
    fetchData();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading order...</p>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-green-700">Thank you for your order!</h1>
            <p className="text-gray-600 mb-6">Your order has been placed successfully. A confirmation email has been sent to <strong>{order.customerEmail}</strong>.</p>
            
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <p className="text-sm text-gray-500 mb-1">Order ID: #{order.id}</p>
              <p className="text-sm text-gray-500 mb-4">Placed on: {order.date}</p>

              {order.items.map((item, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity} × ${item.price}</p>
                </div>
              ))}

              <div className="mt-4 text-right">
                <p className="text-xl font-bold text-gray-800">Total: ${order.total}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderConfirmationPage;
