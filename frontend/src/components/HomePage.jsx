import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white fixed w-full z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="font-bold text-xl">TheOnlyGoodCameraStore</div>
            <div className="flex space-x-4 items-center">
              <Link to="/about" className="text-white hover:text-gray-200 transition-colors px-4 py-2">
                About
              </Link>
              <Link to="/auth" className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to push content below fixed navbar */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 py-20 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Revolutionizing Camera Experience
              </h1>
              <p className="text-xl md:text-2xl">
                TheOnlyGoodCameraStore connects photographers to premium camera equipment,
                optimizing your camera's potential and maximizing creative potential.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/auth" 
                  className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <a
                  href="#about"
                  className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-white/10 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative h-80 md:h-96">
              <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Featured Cameras</h3>
                    <p className="text-lg mb-6">Explore our premium cameras from top-rated brands.</p>
                    <a
                      href="/products"
                      className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Browse Inventory
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-indigo-600">1200+</p>
              <p className="text-gray-600 mt-2">Active Photographers</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-indigo-600">5000+</p>
              <p className="text-gray-600 mt-2">Camera Sales</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-indigo-600">95%</p>
              <p className="text-gray-600 mt-2">Satisfaction Rate</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-indigo-600">24/7</p>
              <p className="text-gray-600 mt-2">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About TheOnlyGoodCameraStore
            </h2>
            <p className="text-xl text-gray-600">
              TheOnlyGoodCameraStore is revolutionizing how photographers access premium camera equipment
              to improve their photography and maximize creative potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Cameras</h3>
              <p className="text-gray-600">Access to the highest quality cameras and lenses from top-rated brands with proven track records.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Transactions</h3>
              <p className="text-gray-600">Our platform simplifies the camera buying process with secure, transparent transactions.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">Access to photography experts who can help you choose the best camera for your specific needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade Your Photography?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied photographers who have enhanced their
            photography and improved their creative potential using TheOnlyGoodCameraStore.
          </p>
          <Link 
            to="/auth" 
            className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default HomePage; 