const express = require('express');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const db = req.app.locals.db.db('cameraStore');

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const usersCollection = db.collection('userAuth');
    const existingUser = await usersCollection.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    const insertedUser = await usersCollection.findOne({ _id: result.insertedId });

    const { password: _, ...userWithoutPassword } = insertedUser;
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = req.app.locals.db.db('cameraStore');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const usersCollection = db.collection('userAuth');
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get User Details by Email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;
  const db = req.app.locals.db.db('cameraStore');

  try {
    const usersCollection = db.collection('userAuth');
    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error retrieving user details', error: error.message });
  }
});

// Update User Information by Email
router.put('/user/:email', async (req, res) => {
  const { email } = req.params;
  const updates = req.body;
  const db = req.app.locals.db.db('cameraStore');

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No update information provided' });
  }

  try {
    const usersCollection = db.collection('userAuth');
    const updateData = { ...updates };

    // If a new password is provided, update it. Otherwise, keep the old one.
    if (updates.password) {
      updateData.password = updates.password;
    } else {
      delete updateData.password;
    }

    if (updateData.email && updateData.email !== email) {
      return res.status(400).json({ message: 'Email cannot be changed through this endpoint.' });
    }
    delete updateData.email; 

    const result = await usersCollection.updateOne(
      { email: email },
      { $set: updateData, $currentDate: { lastModified: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      return res.status(200).json({ message: 'No changes detected or user data is the same.' });
    }

    const updatedUser = await usersCollection.findOne({ email: email });
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user information', error: error.message });
  }
});

// Delete User Account by Email
router.delete('/user/:email', async (req, res) => {
  const { email } = req.params;
  const db = req.app.locals.db.db('cameraStore');

  try {
    const usersCollection = db.collection('userAuth');
    const result = await usersCollection.deleteOne({ email: email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user account', error: error.message });
  }
});

module.exports = router; 