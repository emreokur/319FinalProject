import React from 'react';
import { Link } from 'react-router-dom';

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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto">
            <div className="md:w-2/3 flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-4">TheOnlyGoodCameraStore</h3>
                <p className="text-gray-400">
                  Connecting photographers to premium camera equipment to enhance photography quality and creative potential.
                </p>
              </div>
              <div className="md:w-1/2">
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">Products</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="/notFound" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="/notFound" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="/notFound" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TheOnlyGoodCameraStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage; 