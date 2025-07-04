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
    origin: process.env.FRONTEND_URL || "*", // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
});

// Middleware - CORS must come before routes
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - Move this BEFORE the 404 handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'Document Collaboration API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    routes: {
      auth: '/api/auth/login, /api/auth/register',
      documents: '/api/documents',
      ai: '/api/ai/process'
    }
  });
});

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit process on Vercel, just log the error
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Initialize database connection
connectDB();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.use('/api', authRoutes);
app.use('/api', documentRoutes);

// AI processing endpoint
app.post('/api/ai/process', async (req, res) => {
  try {
    const { text, action } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI service not configured' });
    }
    
    // Fix: Use process.env.GEMINI_API_KEY and explicitly pass it
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-1.5-flash"
    });
    
    let promptTemplate;
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
    res.status(500).json({ message: 'Failed to process AI request', error: error.message });
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler - This should be LAST
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// For Vercel, don't start the server if we're in a serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;