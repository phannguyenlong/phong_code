import React, { createContext, useState, useEffect } from 'react';
import RateLimitError from '../components/RateLimitError';

export const RateLimitContext = createContext();

export const RateLimitProvider = ({ children }) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleRateLimit = () => {
      setShowError(true);
      // Hide the error after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    };

    window.addEventListener('rateLimitExceeded', handleRateLimit);
    return () => window.removeEventListener('rateLimitExceeded', handleRateLimit);
  }, []);

  return (
    <RateLimitContext.Provider value={{ showError, setShowError }}>
      {children}
      {showError && <RateLimitError />}
    </RateLimitContext.Provider>
  );
}; 