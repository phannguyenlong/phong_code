// src/main.jsx
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const theme = createTheme({
  primaryColor: 'orange',
  colors: {
    orange: [
      '#FFF0E6',
      '#FFE0CC',
      '#FFD1B3',
      '#FFC299',
      '#FFB380',
      '#FFA366',
      '#FF944D',
      '#FF8533',
      '#FF751A',
      '#FF6600',
    ],
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <BrowserRouter basename="/assignment2">
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);