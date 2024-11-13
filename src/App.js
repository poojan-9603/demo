// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import HomePage from './pages/HomePage';
import BikeCost from './pages/BikeCost'; 
import Dashboard from './pages/Dashboard';
import PublicTransport from './pages/PublicTransport'; // Import the new component
import Ran from './pages/Ran'; // Import the new component
import DoTheMath from './pages/DoTheMath'; // Import the DoTheMath component


const App = () => {
  const [currentUserId, setCurrentUserId] = useState(null); // Define currentUserId state

  useEffect(() => {
    const auth = getAuth();
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user ID
        setCurrentUserId(user.uid);
      } else {
        // User is signed out, clear the user ID
        setCurrentUserId(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/home" element={<HomePage userId={currentUserId} />} />
          <Route path="/bike-cost" element={<BikeCost userId={currentUserId} />} />
          <Route path="/dashboard" element={<Dashboard userId={currentUserId} />} />
          <Route path="/public-transport" element={<PublicTransport />} /> {/* New route */}
          <Route path="/ran" element={<Ran />} /> {/* New route */}
          <Route path="/doTheMath" element={<DoTheMath />} /> {/* Add the route for DoTheMath */}

        </Routes>
      </div>
    </Router>
  );
};

export default App;