import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products by search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* Add padding to push content below fixed navbar */}
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Premium Camera Equipment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Browse our selection of high-quality cameras and accessories from top brands
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <label htmlFor="sort-by" className="text-gray-700 font-medium">Sort by:</label>
              <select 
                id="sort-by"
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 bg-white text-gray-700"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="search" className="sr-only">Search products</label>
              <div className="flex items-center">
                <input
                  id="search"
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-4 text-gray-700"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="ml-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-red-600">{error}</h3>
            <p className="mt-1 text-gray-600">
              Please try refreshing the page or check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-600">
                  {searchQuery ? `No results matching "${searchQuery}". Try a different search term.` : 'Check back soon for new listings or try changing your filters.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                    <div className="relative h-48 w-full">
                      {product.images ? (
                        <img 
                          src={product.images} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Seller:</span> {product.seller?.name || 'Unknown Seller'}
                      </p>
                      <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-700">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {product.quantity} available
                        </span>
                      </div>
                      <div className="mt-4">
                        <Link 
                          to={`/products/${product.id}`}
                          className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductsPage; 