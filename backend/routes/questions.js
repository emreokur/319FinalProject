// backend/routes/questions.js
const express = require('express');
const router = express.Router();

// POST /api/questions
// → Submit a new user question
router.post('/', async (req, res, next) => {
  const { email, question } = req.body;
  if (!email || !question) {
    return res.status(400).json({ message: 'Email and question are required' });
  }
  const db = req.app.locals.db.db('cameraStore');
  try {
    const doc = {
      email,
      question,
      resolved: false,
      createdAt: new Date()
    };
    const result = await db.collection('questions').insertOne(doc);
    res.status(201).json({ 
      message: 'Question submitted successfully', 
      question: { ...doc, _id: result.insertedId } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/questions
// → Fetch questions (optionally filter by ?email=)
router.get('/', async (req, res, next) => {
  const { email } = req.query;
  const db = req.app.locals.db.db('cameraStore');
  try {
    const filter = email ? { email } : {};
    const questions = await db
      .collection('questions')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
