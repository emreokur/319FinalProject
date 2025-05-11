import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Parse the ID as an integer for comparison
        const numericId = parseInt(id);
        console.log('Fetching product with ID:', numericId);
        
        // Fetch the specific product
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch product');
        }
        
        const data = await response.json();
        console.log('Product data received:', data.product);
        setProduct(data.product);
        
        // Fetch recommendations (all products to filter from)
        const allProductsResponse = await fetch('http://localhost:3000/api/products');
        
        if (allProductsResponse.ok) {
          const allData = await allProductsResponse.json();
          // Get recommendations (excluding current product)
          // Convert id to number for comparison since product.id is now an integer
          const recs = allData.products.filter(p => p.id !== numericId);
          setRecommendations(recs.slice(0, 3)); // Just take up to 3 recommendations
        } else {
          console.warn('Failed to fetch recommendations');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message || 'Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart
    // For now, just navigate to a placeholder cart page
    navigate('/cart');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-16"></div>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading product details...</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="pt-16"></div>
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100 max-w-7xl mx-auto my-10">
          <h3 className="text-lg font-medium text-gray-900">{error || 'Product not found'}</h3>
          <p className="mt-1 text-gray-600">
            {error ? 'Please try again later.' : 'The product you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link 
            to="/products"
            className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Products
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* Add padding to push content below fixed navbar */}
      <div className="pt-16"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            </li>
            <li className="before:content-['/'] before:mx-2">
              <span className="text-gray-700 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.images} 
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
              
              <div className="mt-2 flex items-center">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Seller:</span> {product.seller?.name || 'Unknown Seller'}
                </p>
                <p className="ml-4 text-sm text-gray-600">
                  <span className="font-medium">Availability:</span> {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </p>
              </div>
              
              <div className="mt-4 text-3xl font-bold text-indigo-700">
                ${product.price.toFixed(2)}
              </div>
              
              <p className="mt-6 text-gray-700">
                {product.description}
              </p>
              
              {/* Specifications */}
              {product.specs && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to Cart Button */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  disabled={product.quantity <= 0}
                >
                  Add to Cart
                </button>
                <button
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((rec) => (
                <div key={rec.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                  <div className="relative h-48 w-full">
                    <img 
                      src={rec.images} 
                      alt={rec.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <Link to={`/products/${rec.id}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                        {rec.name}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-700">
                        ${rec.price.toFixed(2)}
                      </span>
                      <Link 
                        to={`/products/${rec.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail; 