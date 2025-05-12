import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('products');
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [errorQ, setErrorQ] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(new Set());

  const filteredOrders = adminOrders.filter(o =>
    o._id.includes(searchTerm) ||
    o.shipping.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  function toggleExpand(id) {
    setExpanded(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    images: ''
  });

  useEffect(() => {
    if (activeSection === 'orders') {
      fetchAdminOrders();
    }
  }, [activeSection]);

  const fetchAdminOrders = async () => {
    setLoadingOrders(true);
    setErrorOrders(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('http://localhost:3000/api/orders/admin', {
        headers: {
          'UserId': user._id || user.email,
          'UserRole': user.role || ''
        }
      });
      if (!res.ok) throw new Error(await res.text());
      setAdminOrders(await res.json());
    } catch (e) {
      console.error(e);
      setErrorOrders(e.message);
    } finally {
      setLoadingOrders(false);
    }
  };


  // Check if user is admin on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData || userData.role !== 'admin') {
      navigate('/products');
    } else {
      fetchProducts();
    }
  }, [navigate]);

  useEffect(() => {
    if (activeSection === 'questions') {
      fetchQuestions();
    }
  }, [activeSection]);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoadingQ(true);
      setErrorQ(null);
      const res = await fetch('http://localhost:3000/api/questions');
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      // only show unresolved
      setQuestions(data.filter(q => !q.resolved));
    } catch (err) {
      console.error(err);
      setErrorQ('Failed to load questions');
    } finally {
      setLoadingQ(false);
    }
  };


  async function handleResolve(id) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/questions/${id}/resolve`,
        { method: 'PATCH' }
      );
      if (!res.ok) throw new Error('Resolve failed');
      // mark it in-place instead of removing
      setQuestions(qs =>
        qs.map(q =>
          q._id === id ? { ...q, resolved: true } : q
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  const handleDeleteQ = async (id) => {
    if (!window.confirm('Really delete this question?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      setQuestions(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
  };

  useEffect(() => {
    if (activeSection === 'products') {
      fetchProducts();
    }
  }, [activeSection]);


  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      // Convert price and quantity to numbers before sending to API
      const productToAdd = {
        ...currentProduct,
        price: parseFloat(currentProduct.price) || 0,
        quantity: parseInt(currentProduct.quantity) || 0
      };

      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      // Reset form and refresh products list
      setCurrentProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        images: ''
      });

      fetchProducts();
      alert('Product added successfully!');

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    try {
      // Make sure the ID is an integer both in the URL and request body
      const productId = parseInt(currentProduct.id);

      // Prepare the product data with proper type conversions
      const productToUpdate = {
        ...currentProduct,
        id: productId, // Ensure ID is an integer
        price: parseFloat(currentProduct.price) || 0,
        quantity: parseInt(currentProduct.quantity) || 0
      };

      console.log('Updating product:', productToUpdate); // Add logging to debug

      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      // Reset form and refresh products list
      setCurrentProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        images: ''
      });

      setFormMode('add');
      fetchProducts();
      alert('Product updated successfully!');

    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Failed to update product: ${error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // productId should already be an integer, but let's make sure
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        fetchProducts();
        alert('Product deleted successfully!');

      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const editProduct = (product) => {
    // Clone the product to avoid direct state mutation
    console.log('Editing product:', product);

    // When editing a product, convert numeric values to strings for the form inputs
    // while preserving all other fields
    setCurrentProduct({
      ...product, // Keep all original fields
      price: product.price ? product.price.toString() : '',
      quantity: product.quantity ? product.quantity.toString() : ''
    });

    setFormMode('edit');
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-16"></div>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Dashboard tabs */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-sm ${activeSection === 'products'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveSection('products')}
            >
              Modify Products
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${activeSection === 'orders'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveSection('orders')}
            >
              Orders
            </button>

            <button
              onClick={() => setActiveSection('questions')}
              className={`py-4 px-6 font-medium text-sm ${activeSection === 'questions'

                ? 'border-b-2 border-indigo-600 text-indigo-600'

                : 'text-gray-500 hover:text-gray-700'

                }`}

            >
              Questions

            </button>

          </div>
        </div>

        {activeSection === 'products' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {formMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>

              <form onSubmit={formMode === 'add' ? handleAddProduct : handleEditProduct} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={currentProduct.price}
                        onChange={handleInputChange}
                        required
                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 py-2"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      value={currentProduct.quantity}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="images"
                    name="images"
                    value={currentProduct.images}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {formMode === 'add' ? 'Add Product' : 'Update Product'}
                  </button>

                  {formMode === 'edit' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProduct({
                          name: '',
                          description: '',
                          price: '',
                          quantity: '',
                          images: ''
                        });
                        setFormMode('add');
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Product List
              </h2>

              {error ? (
                <div className="text-red-500 mb-4">{error}</div>
              ) : products.length === 0 ? (
                <div className="text-gray-500">No products found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={product.images}
                                  alt={product.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => editProduct(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>

            <div className="mb-4 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search by Order ID or Email…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded-md flex-1"
              />
              <button
                onClick={fetchAdminOrders}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>

            {loadingOrders ? (
              <p>Loading orders…</p>
            ) : errorOrders ? (
              <p className="text-red-600">{errorOrders}</p>
            ) : adminOrders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'ID', 'Customer', 'Total',
                        'Received', 'Packed', 'Shipped', 'Delivered', 'Actions'
                      ].map(h => (
                        <th
                          key={h}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => {
                      const { _id, shipping, total, status, items } = order;
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      const headers = { 'UserId': user._id || user.email, 'UserRole': user.role || '' };

                      const toggle = async (field, current) => {
                        await fetch(
                          `http://localhost:3000/api/orders/admin/${_id}/status`,
                          {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              'UserId': user._id,
                              'UserRole': user.role
                            },
                            body: JSON.stringify({ status: field, completed: !current })
                          }
                        );

                        fetchAdminOrders();
                      };

                      const del = async () => {
                        if (!confirm('Really delete this order?')) return;
                        await fetch(
                          `http://localhost:3000/api/orders/admin/${_id}`,
                          { method: 'DELETE', headers }
                        );
                        fetchAdminOrders();
                      };

                      return (
                        <React.Fragment key={_id}>
                          <tr>
                            <td className="px-4 py-2">
                              <button onClick={() => toggleExpand(_id)} className="mr-2 text-lg">
                                {expanded.has(_id) ? '▼' : '▶'}
                              </button>
                              {_id}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{shipping.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              ${total.toFixed(2)}
                            </td>
                            {['received_order', 'packed', 'shipped', 'delivered'].map(f => (
                              <td key={f} className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={status[f].completed}
                                  onChange={() => toggle(f, status[f].completed)}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-2 text-sm">
                              <button
                                onClick={del}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>

                          {expanded.has(_id) && (
                            <tr className="bg-gray-50">
                              <td colSpan={8} className="px-8 pb-4">
                                <strong>Items:</strong>
                                <ul className="mt-2 space-y-1">
                                  {items.map((it, i) => (
                                    <li key={i} className="flex justify-between">
                                      <img
                                        src={it.image || '/path/to/default-image.jpg'}
                                        alt={it.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <span>{it.name} × {it.quantity}</span>

                                      <span>
                                        {(it.subtotal ?? it.price * it.quantity * 1.07).toLocaleString(undefined, {
                                          style: 'currency',
                                          currency: 'USD',
                                        })}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {activeSection === 'questions' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Submitted Questions</h2>

            {loadingQ ? (
              <p>Loading questions…</p>
            ) : errorQ ? (
              <p className="text-red-600">{errorQ}</p>
            ) : questions.length === 0 ? (
              <p className="text-gray-500">No questions yet.</p>
            ) : (
              <ul className="space-y-4">
                {questions.map(q => (
                  <li key={q._id} className="border p-4 rounded-lg">
                    <p className="font-medium text-gray-800 mb-1">{q.question}</p>
                    <p className="text-sm text-gray-600 mb-3">{q.email}</p>
                    <div className="flex items-center gap-2">
                      {q.resolved ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Resolved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleResolve(q._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteQ(q._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


      </div>
    </div>
  );
}

export default AdminDashboard; 