// src/App.jsx
import React from 'react';
import { Divider } from '@mantine/core';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import SideBar from './components/SideBar';

import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/LoginPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <SideBar />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <RecipePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-recipe" 
              element={
                <ProtectedRoute>
                  <CreateRecipePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipe/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditRecipePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Divider my="xs" labelPosition="center" />
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;