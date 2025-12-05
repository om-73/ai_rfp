import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VendorManager from './pages/VendorManager';

import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import RFPDetail from './pages/RFPDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendors" element={<VendorManager />} />
            <Route path="/create-rfp" element={<CreateRFP />} />
            <Route path="/rfps/:id" element={<RFPDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
