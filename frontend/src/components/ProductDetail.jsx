import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

// Using the same mock products data
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Professional DSLR Camera",
    description: "High-end professional DSLR camera with exceptional image quality and versatile shooting capabilities. Features include a 45.7MP full-frame sensor, advanced autofocus system with 153 focus points, 4K UHD video recording, and weather-sealed construction for durability in various shooting conditions. Comes with a versatile 24-70mm f/2.8 lens that's perfect for everything from portraits to landscapes.",
    price: 1499.99,
    quantity: 5,
    images: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    sellerId: "seller1",
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-06-01"),
    seller: {
      name: "Premium Camera Shop"
    },
    specs: {
      sensorType: "Full-frame CMOS",
      resolution: "45.7 megapixels",
      isoRange: "64-25,600 (expandable to 102,400)",
      focusPoints: "153",
      videoResolution: "4K Ultra HD",
      batteryLife: "1,840 shots per charge"
    }
  },
  {
    id: "2",
    name: "Mirrorless Camera Kit",
    description: "Compact mirrorless camera with 24MP sensor, 4K video recording, and versatile lens compatibility. This lightweight system delivers exceptional image quality while being significantly more portable than traditional DSLRs. The electronic viewfinder provides real-time exposure preview, and the 5-axis image stabilization ensures sharp images even in low light conditions.",
    price: 899.99,
    quantity: 12,
    images: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop",
    sellerId: "seller2",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-25"),
    seller: {
      name: "Camera World"
    },
    specs: {
      sensorType: "APS-C CMOS",
      resolution: "24.2 megapixels",
      isoRange: "100-32,000",
      focusPoints: "425",
      videoResolution: "4K at 30fps",
      batteryLife: "710 shots per charge"
    }
  },
  {
    id: "3",
    name: "Ultra-Wide Angle Lens",
    description: "Professional ultra-wide angle lens with f/2.8 aperture, perfect for landscape and architectural photography. The constant f/2.8 aperture allows for excellent low-light performance, while the premium optics minimize distortion typically associated with ultra-wide lenses. Includes a specialized lens hood to reduce flare and built-in weather sealing for shooting in challenging conditions.",
    price: 649.99,
    quantity: 3,
    images: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Canon_17-40_f4_L_lens.jpg/1200px-Canon_17-40_f4_L_lens.jpg",
    sellerId: "seller1",
    createdAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-07-15"),
    seller: {
      name: "Premium Camera Shop"
    },
    specs: {
      focalLength: "14-24mm",
      maxAperture: "f/2.8",
      minAperture: "f/22",
      filterSize: "82mm",
      weight: "950g",
      construction: "17 elements in 12 groups"
    }
  }
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Simulating API fetch with a timeout
    setTimeout(() => {
      const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get recommendations (products from the same seller excluding current product)
        const recs = MOCK_PRODUCTS.filter(p => 
          p.id !== id && p.sellerId === foundProduct.sellerId
        );
        
        // If not enough recommendations from same seller, add others
        if (recs.length < 2) {
          const otherRecs = MOCK_PRODUCTS.filter(p => 
            p.id !== id && !recs.some(r => r.id === p.id)
          );
          setRecommendations([...recs, ...otherRecs].slice(0, 3));
        } else {
          setRecommendations(recs);
        }
      }
      
      setLoading(false);
    }, 500);
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

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-16"></div>
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100 max-w-7xl mx-auto my-10">
          <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
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
                  <span className="font-medium">Seller:</span> {product.seller.name}
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
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
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
                  <Link to={`/products/${rec.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                      {rec.name}
                    </h3>
                  </Link>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-700">
                      ${rec.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link 
                      to={`/products/${rec.id}`}
                      className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 