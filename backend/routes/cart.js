const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Middleware to verify if user is authenticated
const isAuthenticated = (req, res, next) => {
  const userId = req.headers.userid;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${req.method} ${req.originalUrl}`);
  res.status(500).json({ message: 'Server error' });
};

// Get cart for user
router.get('/', isAuthenticated, async (req, res, next) => {
  const userId = req.userId;
  const db = req.app.locals.db.db('cameraStore');
  
  const userCartsCollection = db.collection('userCarts');
  const userCart = await userCartsCollection.findOne({ userId: userId })
    .catch(err => next(err));
  
  if (!userCart) {
    // Return empty cart if none exists
    return res.status(200).json({
      userId: userId,
      items: [],
      total: 0,
      currency: 'USD'
    });
  }

  res.status(200).json(userCart);
});

// Add item to cart
router.post('/items', isAuthenticated, async (req, res, next) => {
  const userId = req.userId;
  const { productId, name, price, quantity, image } = req.body;
  const db = req.app.locals.db.db('cameraStore');

  if (!productId || !name || !price || !quantity || !image) {
    return res.status(400).json({ message: 'Missing required product information' });
  }

  const numericProductId = parseInt(productId);

  // Check product stock first
  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ id: numericProductId })
    .catch(err => next(err));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (product.quantity <= 0) {
    return res.status(400).json({ message: 'Product is out of stock' });
  }

  const userCartsCollection = db.collection('userCarts');
  const userCart = await userCartsCollection.findOne({ userId: userId })
    .catch(err => next(err));
  
  const subtotal = price * quantity;

  if (!userCart) {
    if (quantity > product.quantity) {
      return res.status(400).json({ 
        message: `Cannot add ${quantity} items. Only ${product.quantity} in stock.` 
      });
    }

    // Create new cart if user doesn't have one
    const newCart = {
      userId: userId,
      cartId: `cart_${new ObjectId().toString()}`,
      createdAt: new Date().toISOString(),
      items: [{
        productId: numericProductId,
        name,
        price,
        quantity,
        image,
        subtotal
      }],
      total: subtotal,
      currency: 'USD'
    };

    await userCartsCollection.insertOne(newCart)
      .catch(err => next(err));
    return res.status(201).json(newCart);
  }

  // Check if item already exists in cart
  const existingItemIndex = userCart.items.findIndex(item => parseInt(item.productId) === numericProductId);

  if (existingItemIndex !== -1) {
    const newQuantity = userCart.items[existingItemIndex].quantity + quantity;
    
    // Check if the new quantity exceeds stock
    if (newQuantity > product.quantity) {
      return res.status(400).json({ 
        message: `Cannot add more items. Current cart: ${userCart.items[existingItemIndex].quantity}, Requested: ${quantity}, Stock: ${product.quantity}` 
      });
    }
    
    userCart.items[existingItemIndex].quantity = newQuantity;
    userCart.items[existingItemIndex].subtotal = userCart.items[existingItemIndex].price * newQuantity;
  } else {
    if (quantity > product.quantity) {
      return res.status(400).json({ 
        message: `Cannot add ${quantity} items. Only ${product.quantity} in stock.` 
      });
    }
    
    // Add new item to cart
    userCart.items.push({
      productId: numericProductId,
      name,
      price,
      quantity,
      image,
      subtotal
    });
  }

  // Recalculate total
  userCart.total = userCart.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Update cart in database
  await userCartsCollection.updateOne(
    { userId: userId },
    { $set: {
        items: userCart.items,
        total: userCart.total
      }
    }
  ).catch(err => next(err));

  res.status(200).json(userCart);
});

// Update item quantity in cart
router.put('/items/:productId', isAuthenticated, async (req, res, next) => {
  const userId = req.userId;
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;
  const db = req.app.locals.db.db('cameraStore');

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  const productsCollection = db.collection('products');
  const product = await productsCollection.findOne({ id: productId })
    .catch(err => next(err));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (quantity > product.quantity) {
    return res.status(400).json({ 
      message: `Cannot update to ${quantity} items. Only ${product.quantity} in stock.` 
    });
  }

  const userCartsCollection = db.collection('userCarts');
  const userCart = await userCartsCollection.findOne({ userId: userId })
    .catch(err => next(err));

  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const itemIndex = userCart.items.findIndex(item => parseInt(item.productId) === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  userCart.items[itemIndex].quantity = quantity;
  userCart.items[itemIndex].subtotal = userCart.items[itemIndex].price * quantity;

  userCart.total = userCart.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Update cart in database
  await userCartsCollection.updateOne(
    { userId: userId },
    { $set: {
        items: userCart.items,
        total: userCart.total
      }
    }
  ).catch(err => next(err));

  res.status(200).json(userCart);
});

// Remove item from cart
router.delete('/items/:productId', isAuthenticated, async (req, res, next) => {
  const userId = req.userId;
  const productId = parseInt(req.params.productId);
  const db = req.app.locals.db.db('cameraStore');

  const userCartsCollection = db.collection('userCarts');
  const userCart = await userCartsCollection.findOne({ userId: userId })
    .catch(err => next(err));

  if (!userCart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  const updatedItems = userCart.items.filter(item => parseInt(item.productId) !== productId);

  if (updatedItems.length === userCart.items.length) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  const updatedTotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Update cart in database
  await userCartsCollection.updateOne(
    { userId: userId },
    { $set: {
        items: updatedItems,
        total: updatedTotal
      }
    }
  ).catch(err => next(err));

  res.status(200).json({
    userId: userId,
    cartId: userCart.cartId,
    items: updatedItems,
    total: updatedTotal,
    currency: userCart.currency
  });
});

// Clear cart
router.delete('/', isAuthenticated, async (req, res, next) => {
  const userId = req.userId;
  const db = req.app.locals.db.db('cameraStore');

  const userCartsCollection = db.collection('userCarts');
  const result = await userCartsCollection.updateOne(
    { userId: userId },
    { $set: {
        items: [],
        total: 0
      }
    }
  ).catch(err => next(err));

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json({
    userId: userId,
    items: [],
    total: 0,
    currency: 'USD'
  });
});

router.use(errorHandler);

module.exports = router; 