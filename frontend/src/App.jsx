import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminEmailPage from './components/AdminEmailPage';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import AboutPage from './components/AboutPage';
import ProductsPage from './components/ProductPage';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderManagementPage from './components/OrderManagementPageCustomer';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import OrderShippedPage from './components/OrderShippedPage';
import NotFound from './components/NotFound';
import OrderManagementPageClient from './components/OrderManagementPageClient';
import AccountPage from './components/AccountPage';
import AdminDashboard from './components/AdminDashboard';
import ShippingEstimatePage from './components/ShippingEstimatePage';

import SalesAnalyticsPage from './components/SalesAnalyticsPage';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/admin/email" element={<AdminEmailPage />} />
        <Route path="/shipping" element={<ShippingEstimatePage />} />
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
        <Route path="/orders/client" element={<OrderManagementPageClient />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<SalesAnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
