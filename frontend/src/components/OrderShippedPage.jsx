import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
// import { fetchShippedOrderById } from './services/orderService'; // Backend logic (commented out)
import { useParams } from 'react-router-dom';

function OrderShippedPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock shipping data
  const mockShippedOrder = {
    id: orderId || 'cm96i27w',
    shippingDate: '4/8/2025',
    deliveryEstimate: '4/11/2025',
    trackingNumber: '1Z999AA10123456784',
    items: [
      {
        name: 'Sony Camera',
        quantity: 1,
        price: 999.99,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      // const data = await fetchShippedOrderById(orderId);
      const data = mockShippedOrder;
      setOrder(data);
      setLoading(false);
    };
    fetchData();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading shipping info...</p>;

  return (
    <main className="min-h-screen bg-gray-100 pt-16">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Your Order Has Shipped!</h1>
          <p className="text-gray-600 mb-6">
            Order <strong>#{order.id}</strong> was shipped on <strong>{order.shippingDate}</strong> and is estimated to arrive by <strong>{order.deliveryEstimate}</strong>.
          </p>

          <div className="mb-4">
            <p className="text-sm text-gray-700">Tracking Number:</p>
            <p className="font-medium text-gray-900">{order.trackingNumber}</p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Items Shipped</h2>
            {order.items.map((item, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity} × ${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderShippedPage;
