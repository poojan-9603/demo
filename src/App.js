// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import BikeCost from './pages/BikeCost'; 
import Dashboard from './pages/Dashboard';
import PublicTransport from './pages/PublicTransport';
import Ran from './pages/Ran';
import DoTheMath from './pages/DoTheMath';

const App = () => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router basename="/demo"> {/* Added basename for GitHub Pages */}
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/home" element={<HomePage userId={currentUserId} />} />
          <Route path="/bike-cost" element={<BikeCost userId={currentUserId} />} />
          <Route path="/dashboard" element={<Dashboard userId={currentUserId} />} />
          <Route path="/public-transport" element={<PublicTransport />} />
          <Route path="/doTheMath" element={<DoTheMath />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
