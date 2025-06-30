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
    origin: process.env.FRONTEND_URL, // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api', authRoutes);
app.use('/api', documentRoutes);

// Add this endpoint to your server.js file after your existing AI endpoints

app.post('/api/ai/process', async (req, res) => {
  try {
    const { text, action } = req.body;
    
    // Fix: Use process.env.GEMINI_API_KEY and explicitly pass it
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-1.5-flash"
    });
    
    let promptTemplate;
    let inputVariables;
    let chainInput;
    
    switch (action) {
      case 'summarize':
        promptTemplate = new PromptTemplate({
          template: "Summarize the following text in a concise way while retaining all key information: {text}",
          inputVariables: ["text"],
        });
        chainInput = { text };
        break;
        
      case 'improve':
      case 'improve-full':
        promptTemplate = new PromptTemplate({
          template: "Improve the following text by enhancing clarity, fixing grammar, improving word choice, and making it more engaging: {text}",
          inputVariables: ["text"],
        });
        chainInput = { text };
        break;
        
      case 'define':
        promptTemplate = new PromptTemplate({
          template: "Provide a dictionary-style definition for the word or phrase: {text}. Include: 1) part of speech, 2) pronunciation if relevant, 3) definition(s), 4) example usage in a sentence, 5) synonyms if applicable.",
          inputVariables: ["text"],
        });
        chainInput = { text };
        break;
        
      case 'translate':
        
        promptTemplate = new PromptTemplate({
          template: "Translate the following text into {targetLanguage}: {text}",
          inputVariables: ["text", "targetLanguage"],
        });
        chainInput = { text, targetLanguage: req.body.targetLanguage || 'Hindi' };
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid action specified' });
    }
    
    const chain = new LLMChain({ llm: model, prompt: promptTemplate });
    const result = await chain.call(chainInput);
    
    res.json({ result: result.text });
  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({ message: 'Failed to process AI request' });
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