const express     = require('express');
const { ObjectId } = require('mongodb');
const router      = express.Router();

const isAuthenticated = (req, res, next) => {
  const userId = req.headers.userid;
  if (!userId) return res.status(401).json({ message: 'Authentication required' });
  req.userId = userId;
  next();
};

router.post('/', isAuthenticated, async (req, res, next) => {
  const db = req.app.locals.db.db('cameraStore');

  try {
    const {
      fullName, email, address, city, state, zipCode, country,
      items, subtotal, tax, shippingCost, total
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const order = {
      userId: req.userId,
      shipping: { fullName, email, address, city, state, zipCode, country },
      items,
      subtotal,
      tax,
      shippingCost,
      total,
      status: {
        received_order: { completed: true,  at: new Date() },
        packed:         { completed: false, at: null },
        shipped:        { completed: false, at: null },
        delivered:      { completed: false, at: null },
      },
      createdAt: new Date()
    };
    const result = await db.collection('orders').insertOne(order);

    // 2) Decrement each product’s stock
    //    If you care about going negative, you should check first.
    await Promise.all(items.map(it =>
      db.collection('products').updateOne(
        { _id: new ObjectId(it.productId) },
        { $inc: { quantity: -it.quantity } }
      )
    ));

    // 3) Return the new order’s ID
    res.status(201).json({ orderId: result.insertedId.toString() });

  } catch (err) {
    next(err);
  }
});

// Fetch a single order (owner only)
router.get('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const db = req.app.locals.db.db('cameraStore');
    const order = await db.collection('orders').findOne({
      _id:    new ObjectId(req.params.id),
      userId: req.userId
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});


// List all orders for current user
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const db = req.app.locals.db.db('cameraStore');
    const orders = await db
      .collection('orders')
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Cancel an order (only if not packed yet)
router.patch('/:id/cancel', isAuthenticated, async (req, res, next) => {
  try {
    const db = req.app.locals.db.db('cameraStore');
    const result = await db.collection('orders').updateOne(
      {
        _id: new ObjectId(req.params.id),
        userId: req.userId,
        'status.packed.completed': false
      },
      { $set: { 'status.cancelled': { completed: true, at: new Date() } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Cannot cancel: already packed or not found.' });
    }
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
});

// Request return (only if shipped and not already requested)
router.patch('/:id/return', isAuthenticated, async (req, res, next) => {
  try {
    const db = req.app.locals.db.db('cameraStore');
    const result = await db.collection('orders').updateOne(
      {
        _id: new ObjectId(req.params.id),
        userId: req.userId,
        'status.shipped.completed': true,
        'status.return_requested': { $exists: false }
      },
      { $set: { 'status.return_requested': { requested: true, at: new Date() } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Cannot request return.' });
    }
    res.json({ message: 'Return requested' });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
