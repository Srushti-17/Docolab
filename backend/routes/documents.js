const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Document = require('../models/Document');
const User = require('../models/User');

// Middleware to authenticate token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get all documents for a user
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ]
    }).sort({ lastModified: -1 });
    
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new document
router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    const newDocument = new Document({
      title: title || 'Untitled Document',
      owner: req.user.id,
      content: ''
    });
    
    const document = await newDocument.save();
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific document
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is owner or collaborator
    if (document.owner.toString() !== req.user.id && 
        !document.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

// Update a document
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is owner or collaborator
    if (document.owner.toString() !== req.user.id && 
        !document.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedFields = {
      lastModified: Date.now()
    };
    
    if (title) updatedFields.title = title;
    if (content !== undefined) updatedFields.content = content;
    
    document = await Document.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete a document
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is the owner
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can delete this document' });
    }
    
    await document.deleteOne();
    
    res.json({ message: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
});

// Add collaborator to document
router.post('/:id/collaborators', auth, async (req, res) => {
  try {
    const { email } = req.body;
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is the owner
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can add collaborators' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a collaborator
    if (document.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }
    
    // Add collaborator
    document.collaborators.push(user._id);
    await document.save();
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove collaborator from document
router.delete('/:id/collaborators/:userId', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is the owner
    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the owner can remove collaborators' });
    }
    
    // Check if user is a collaborator
    const collaboratorIndex = document.collaborators.indexOf(req.params.userId);
    
    if (collaboratorIndex === -1) {
      return res.status(400).json({ message: 'User is not a collaborator' });
    }
    
    // Remove collaborator
    document.collaborators.splice(collaboratorIndex, 1);
    await document.save();
    
    res.json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;