// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./pages/00Navbar"; 
import Home from "./pages/01Home";
import Generate from "./pages/02Generate";
import Templates from "./pages/03Templates"
import About from "./pages/04About";

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
