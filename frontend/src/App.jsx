import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import OrderManagementPage from './components/OrderManagementPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderShippedPage from './components/OrderShippedPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/order/confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/order/shipped/:orderId" element={<OrderShippedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
