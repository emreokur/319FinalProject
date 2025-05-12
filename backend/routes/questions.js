const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// POST /api/questions
// → Submit a new user question
router.post('/', async (req, res, next) => {
  const { email, question } = req.body;
  if (!email || !question) {
    return res.status(400).json({ message: 'Email and question are required' });
  }
  const db = req.app.locals.db.db('cameraStore');
  try {
    const doc = { email, question, resolved: false, createdAt: new Date() };
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
// → Fetch all questions
router.get('/', async (req, res, next) => {
  const db = req.app.locals.db.db('cameraStore');
  try {
    const questions = await db
      .collection('questions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/questions/:id/resolve
// → Mark a question as resolved
router.patch('/:id/resolve', async (req, res, next) => {
    try {
      const id = req.params.id;
      const db = req.app.locals.db.db('cameraStore');
      const result = await db
        .collection('questions')
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { resolved: true } }
        );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }
      res.json({ message: 'Question marked resolved' });
    } catch (err) {
      next(err);
    }
  });
  

// DELETE /api/questions/:id
// → Hard-delete a question
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const db = req.app.locals.db.db('cameraStore');
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
