import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import AboutPage from './components/AboutPage';
import ProductsPage from './components/ProductPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderManagementPage from './components/OrderManagementPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderShippedPage from './components/OrderShippedPage';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderManagementPage />} />
        <Route path="/order/confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/order/shipped/:orderId" element={<OrderShippedPage />} />
        <Route path="/notFound" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
