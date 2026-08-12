// main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ScrollToTop from "./components/Header/ScrollToTop";
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <App />
        <Toaster 
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Manrope, sans-serif',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#EF4444',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
                color: '#fff',
              },
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);