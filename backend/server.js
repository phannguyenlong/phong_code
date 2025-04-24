import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoute.js';
import recipeRoutes from './src/routes/recipeRoutes.js';
import commentRoutes from './src/routes/commentRoute.js';
import searchRoutes from './src/routes/searchRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import categoryRoutes from './src/routes/categoryRouates.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));