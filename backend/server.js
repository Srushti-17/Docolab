const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// AI Endpoints using LangChain
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-pro"
    });
    
    const promptTemplate = new PromptTemplate({
      template: "Summarize the following text in a concise way while retaining all key information: {text}",
      inputVariables: ["text"],
    });
    
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });
    const result = await chain.call({ text });
    
    res.json({ summary: result.text });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ message: 'Failed to summarize text' });
  }
});

app.post('/api/ai/improve', async (req, res) => {
  try {
    const { text } = req.body;
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-pro"
    });
    
    const promptTemplate = new PromptTemplate({
      template: "Improve the following text by enhancing clarity, fixing grammar, improving word choice, and making it more engaging: {text}",
      inputVariables: ["text"],
    });
    
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });
    const result = await chain.call({ text });
    
    res.json({ improved: result.text });
  } catch (error) {
    console.error('Improvement error:', error);
    res.status(500).json({ message: 'Failed to improve text' });
  }
});

app.post('/api/ai/define', async (req, res) => {
  try {
    const { word } = req.body;
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-pro"
    });
    
    const promptTemplate = new PromptTemplate({
      template: "Provide a dictionary-style definition for the word: {word}. Include: 1) part of speech, 2) pronunciation if relevant, 3) definition(s), 4) example usage in a sentence, 5) synonyms if applicable.",
      inputVariables: ["word"],
    });
    
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });
    const result = await chain.call({ word });
    
    res.json({ definition: result.text });
  } catch (error) {
    console.error('Definition error:', error);
    res.status(500).json({ message: 'Failed to get definition' });
  }
});

app.post('/api/ai/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-pro"
    });
    
    const promptTemplate = new PromptTemplate({
      template: "Translate the following text into {targetLanguage}: {text}",
      inputVariables: ["text", "targetLanguage"],
    });
    
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });
    const result = await chain.call({ text, targetLanguage });
    
    res.json({ translation: result.text });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Failed to translate text' });
  }
});

// Socket.io logic for real-time collaboration
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-document', (documentId) => {
    socket.join(documentId);
    console.log(`Client joined document: ${documentId}`);
  });
  
  socket.on('document-change', (data) => {
    socket.to(data.documentId).emit('document-change', data);
  });
  
  socket.on('cursor-position', (data) => {
    socket.to(data.documentId).emit('cursor-position', {
      userId: data.userId,
      username: data.username,
      position: data.position
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));