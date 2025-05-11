const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all products
router.get('/', async (req, res) => {
  const db = req.app.locals.db.db('cameraStore');
  const products = await db.collection('products').find({}).toArray();
  res.json({ products });
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const db = req.app.locals.db.db('cameraStore');
  const productId = parseInt(req.params.id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }
  
  const product = await db.collection('products').findOne({ id: productId });
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ product });
});

// Create a new product
router.post('/', async (req, res) => {
  const db = req.app.locals.db.db('cameraStore');
  
  const count = await db.collection('products').countDocuments();
  const newProduct = {
    ...req.body,
    id: count + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('products').insertOne(newProduct);
  
  if (result.acknowledged) {
    res.status(201).json({ 
      message: 'Product created successfully', 
      product: newProduct 
    });
  } else {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const db = req.app.locals.db.db('cameraStore');
  const productId = parseInt(req.params.id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }
  
  // Create a clean version of the updated product
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price) || 0,
    quantity: parseInt(req.body.quantity) || 0,
    images: req.body.images,
    id: productId,
    updatedAt: new Date()
  };
  
  // If product has other fields like specs, include them
  if (req.body.specs) {
    updatedProduct.specs = req.body.specs;
  }

  // If product has seller information, include it
  if (req.body.seller) {
    updatedProduct.seller = req.body.seller;
  }
  
  // Maintain the original creation date if it exists
  if (req.body.createdAt) {
    updatedProduct.createdAt = new Date(req.body.createdAt);
  }
  
  // First check if the product exists
  const existingProduct = await db.collection('products').findOne({ id: productId });
  
  if (!existingProduct) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }
  
  const result = await db.collection('products').updateOne(
    { id: productId },
    { $set: updatedProduct }
  );
  
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }
  
  if (result.modifiedCount === 0) {
    return res.status(200).json({ 
      message: 'No changes were made to the product',
      product: updatedProduct
    });
  }
  
  res.json({ 
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const db = req.app.locals.db.db('cameraStore');
  const productId = parseInt(req.params.id);
  
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }
  
  const result = await db.collection('products').deleteOne({ id: productId });
  
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router; 