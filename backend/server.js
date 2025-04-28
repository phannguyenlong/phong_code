import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
// import mongoSanitize from 'express-mongo-sanitize';
// import moment from 'moment';

import requestLogger from './src/middleware/loggerMiddleware.js';
import authRoutes from './src/routes/authRoutes.js';
import categoryRoutes from './src/routes/categoryRouates.js';
import commentRoutes from './src/routes/commentRoute.js';
import recipeRoutes from './src/routes/recipeRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import userRoutes from './src/routes/userRoute.js';

dotenv.config();
const app = express();

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Use request logging middleware globally
app.use(requestLogger);

// Security middleware 
app.use(helmet());         // Secure headers
// app.use(mongoSanitize());  // Prevent NoSQL injection

// Middleware

//  // Enable CORS for specific origins 
// const allowedOrigins = ['http://localhost:5000', 'http://localhost:5173', 'https://n12122882.ifn666.com:5173', 'https://n12122882.ifn666.com:5000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser clients like curl, Postman

    const allowedOrigins = [
      'http://localhost:5000', // example if your frontend is on port 3000
      'http://localhost:5173', // or whatever port you want to allow
      'https://n12122882.ifn666.com:5173', // if deployed
      'https://n12122882.ifn666.com:5000'
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // if you need cookies/session
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// fix cors issue
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Apply rate limiters to routes
app.use('/', generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Handle 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error'
  });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));