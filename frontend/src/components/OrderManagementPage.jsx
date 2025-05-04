import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
// import { fetchOrders, updateOrderStatus, deleteOrder } from './services/orderService';

function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake data
  const mockOrders = [
    {
      id: 'cm96i27w',
      date: '4/6/2025',
      customerName: 'John Pork',
      customerEmail: 'jp@email.com',
      status: 'Placed',
      total: 999.99,
      items: [
        {
          name: 'Sony Camera',
          quantity: 1,
          price: 999.99,
        },
      ],
    },
  ];

  useEffect(() => {
    const getOrders = async () => {
      // const data = await fetchOrders();
      const data = mockOrders; // use mock data
      setOrders(data);
      setLoading(false);
    };
    getOrders();
  }, []);

  const handleStatusUpdate = async (orderId) => {
    // await updateOrderStatus(orderId, 'Shipped');
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: 'Shipped' } : order
    );
    setOrders(updatedOrders);
  };

  const handleDelete = async (orderId) => {
    // await deleteOrder(orderId);
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen pt-24 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.customerName} ({order.customerEmail})
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mb-2">
                    {order.status}
                  </span>
                  <p className="text-xl font-bold text-gray-800">${order.total}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                {order.items.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <button
                  onClick={() => handleStatusUpdate(order.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default OrderManagementPage;
