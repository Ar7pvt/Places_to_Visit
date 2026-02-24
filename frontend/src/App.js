import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/location/:id" element={<LocationDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
