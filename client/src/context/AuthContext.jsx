// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth-service';

// Create the auth context
const AuthContext = createContext(null);

// Create a provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setCurrentUser({
    id: userData._id,
    username: userData.username,
    email: userData.email
    });
    return userData;
  };

  // Register function
  const register = async (username, email, password) => {
    const userData = await authService.register(username, email, password);
    setCurrentUser({
      id: userData._id,
      username: userData.username,
      email: userData.email
    });
    return userData;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Values to be provided to consumers
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}