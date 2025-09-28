// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./pages/00Navbar"; 
import Home from "./pages/01Home";
import Generate from "./pages/02Generate";
import Templates from "./pages/03Templates"
import About from "./pages/04About";

// Multi-deployment API configuration
const getApiBaseUrl = () => {
  // Development
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  
  // GitHub Pages
  if (window.location.hostname === 'srivas-saksham.github.io') {
    return 'https://docslayer-backend.onrender.com';
  }
  
  // Vercel
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://docslayer-backend.onrender.com';
  }
  
  // Default production
  return 'https://docslayer-backend.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

// Make API_BASE_URL available globally
window.API_BASE_URL = API_BASE_URL;

// Debug logging (remove in production if needed)
console.log('Current hostname:', window.location.hostname);
console.log('API Base URL:', API_BASE_URL);

function App() {
  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;