import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';

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

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again after an hour'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many API requests, please try again after 15 minutes'
});

// Use request logging middleware globally
app.use(requestLogger);

// Security middleware 
app.use(helmet());         // Secure headers
// app.use(mongoSanitize());  // Prevent NoSQL injection

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Apply rate limiters to routes
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
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