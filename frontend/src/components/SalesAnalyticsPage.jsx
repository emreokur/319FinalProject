// -------------------------------------------------------------
// SalesAnalyticsPage.jsx
// -------------------------------------------------------------
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement,
    Title, Tooltip, Legend
} from 'chart.js';
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend
);

export default function SalesAnalyticsPage() {
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------
   * Load ALL orders (admin‑only route)
   * ---------------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
          return navigate('/products');         // safety guard
        }

        const res = await fetch('http://localhost:3000/api/orders/admin', {
          headers: { UserId: user._id || user.email, UserRole: 'admin' }
        });
        if (!res.ok) throw new Error(await res.text());
        setOrders(await res.json());
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  /* ------------------------------------------------------------------
   * Derived analytics (memoised so they recompute only when orders change)
   * ---------------------------------------------------------------- */
  const {
    totalRevenue, totalOrders, avgOrderValue,
    revenueByDate, topProducts
  } = useMemo(() => {
    if (!orders.length) return {
      totalRevenue: 0, totalOrders: 0, avgOrderValue: 0,
      revenueByDate: {}, topProducts: {}
    };

    let revenue = 0;
    const byDate   = {};           // yyyy‑mm‑dd -> $
    const products = {};           // productName -> qty & sales $

    orders.forEach(o => {
      revenue += o.total;

      const date = new Date(o.createdAt).toISOString().slice(0,10);
      byDate[date] = (byDate[date] || 0) + o.total;

      o.items.forEach(it => {
        if (!products[it.name]) products[it.name] = { qty: 0, sales: 0 };
        products[it.name].qty   += it.quantity;
        products[it.name].sales += (it.subtotal ?? it.price * it.quantity);
      });
    });

    const top = Object.entries(products)
      .sort((a, b) => b[1].sales - a[1].sales)
      .slice(0, 5)                                   // top‑5
      .reduce((obj, [name, stats]) => ({ ...obj, [name]: stats }), {});

    return {
      totalRevenue: revenue,
      totalOrders : orders.length,
      avgOrderValue: revenue / orders.length,
      revenueByDate: byDate,
      topProducts  : top
    };
  }, [orders]);

  /* ------------------------------------------------------------------
   * Build chart datasets
   * ---------------------------------------------------------------- */
   // sort the dates so the line goes left→right
   const sortedDates = Object.keys(revenueByDate).sort();
  
   const lineData = {
     labels: sortedDates,
     datasets: [
       {
         label: 'Revenue ($)',
         data: sortedDates.map(d => revenueByDate[d]),
         tension : 0.3,
         borderWidth: 2,
         borderColor: 'rgb(79, 70, 229)',   // indigo‑600
         backgroundColor: 'rgba(79, 70, 229, .15)',
         fill: true
       }
     ]
   };
  
   const lineOptions = {
     responsive: true,
     maintainAspectRatio: false,   // canvas will stretch to 100% width
     plugins: {
       legend: { position: 'top' },
       tooltip: { callbacks: {
         label: ctx => ctx.parsed.y.toLocaleString('en‑US', {
           style:'currency', currency:'USD'
         })
       }}
     },
     scales: {
       y: {
         ticks: {
           callback: v => '$' + v / 1000 + 'k'
         }
       }
     }
   };
  

  const barData = {
    labels: Object.keys(topProducts),
    datasets: [
      {
        label: 'Sales ($)',
        data: Object.values(topProducts).map(p => p.sales)
      }
    ]
  };

  const doughnutData = {
    labels: Object.keys(topProducts),
    datasets: [
      {
        label: 'Units Sold',
        data: Object.values(topProducts).map(p => p.qty)
      }
    ]
  };

  /* ------------------------------------------------------------------ */

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 flex justify-center items-center h-[60vh]">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
          <span className="ml-4 text-gray-600">Loading analytics…</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-20 text-center text-red-600">
          <p>{error}</p>
          <Link to="/admin" className="text-indigo-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-4 py-8 space-y-10">

        <h1 className="text-3xl font-extrabold mb-6">Sales Analytics</h1>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            ['Total Revenue', totalRevenue],
            ['Total Orders',  totalOrders],
            ['Avg Order Value', avgOrderValue]
          ].map(([label, val]) => (
            <div key={label} className="bg-white shadow rounded-lg p-6">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-indigo-700">
                {val.toLocaleString(undefined, {
                  style: label.includes('Orders') ? 'decimal' : 'currency',
                  currency: 'USD',
                  maximumFractionDigits: label.includes('Orders') ? 0 : 2
                })}
              </p>
            </div>
          ))}
        </div>

        {/* --- REVENUE TREND --- */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
          <Line data={lineData} />
        </div>

        {/* --- TOP PRODUCTS (Sales $ + Units) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 Products (Sales $)</h2>
            <Bar data={barData} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 Products (Units Sold)</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>

      </div>
    </div>
  );
}