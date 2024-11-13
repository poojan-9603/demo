// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import { db } from '../firebase'; // Import Firestore database
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import './HomePage.css'; // Import the CSS file for styling

const HomePage = () => {
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // Use useNavigate for navigation
  const userId = location.state?.userId; // Retrieve userId from location state

  const [nickname, setNickname] = useState('');
  const [bikingExperience, setBikingExperience] = useState('');
  const [bikingFrequency, setBikingFrequency] = useState('');
  const [hardcoreLevel, setHardcoreLevel] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to hold the user's responses
    const userResponse = {
      nickname,
      bikingExperience,
      bikingFrequency,
      hardcoreLevel,
    };

    // Update the existing user document in Firestore
    try {
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document
      await updateDoc(userDocRef, userResponse); // Update the document with user responses
      alert('Thank you for your responses!');

      // Navigate to the BikeCost page
      navigate('/bike-cost', { state: { userId } });
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('There was an error submitting your response. Please try again.');
    }
  };

  const handleRepaint = () => {
    // Reset all input fields
    setNickname('');
    setBikingExperience('');
    setBikingFrequency('');
    setHardcoreLevel('');
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Are you sure you want to refresh? You might lose your data! 😜";
      event.returnValue = message; // Standard way to set the message
      return message; // For some browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup
    };
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">🚴 Welcome to the Bike Experience Survey!</h1>
      <form className="home-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Previous Biking Experience:</label>
          <div className="radio-group">
            <label className={`experience-option ${bikingExperience === 'beginner' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="beginner"
                checked={bikingExperience === 'beginner'}
                onChange={(e) => setBikingExperience(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Beginner" alt="Beginner" />
              <span>🚲 Beginner</span>
            </label>
            <label className={`experience-option ${bikingExperience === 'intermediate' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="intermediate"
                checked={bikingExperience === 'intermediate'}
                onChange={(e) => setBikingExperience(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Intermediate" alt="Intermediate" />
              <span>🚴 Intermediate</span>
            </label>
            <label className={`experience-option ${bikingExperience === 'advanced' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="advanced"
                checked={bikingExperience === 'advanced'}
                onChange={(e) => setBikingExperience(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Advanced" alt="Advanced" />
              <span>🚵 Advanced</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bikingFrequency">How often do you wish to ride per week?</label>
          <select
            id="bikingFrequency"
            value={bikingFrequency}
            onChange={(e) => setBikingFrequency(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option value="0">0 (Never! 😂)</option>
            <option value="1">1 (Once a week! 😅)</option>
            <option value="2">2 (Twice a week! 🚴‍♂️)</option>
            <option value="3">3 (Thrice a week! 🚴‍♀️)</option>
            <option value="4">4 (Four times a week! 🚵)</option>
            <option value="5">5 (Five times a week! 🚴)</option>
            <option value="6">6 (Almost every day! 😎)</option>
            <option value="7">7 (Every day! 🚴‍♂️💪)</option>
          </select>
        </div>

        <div className="form-group">
          <label>How hardcore are you?</label>
          <div className="radio-group">
            <label className={`experience-option ${hardcoreLevel === 'fair' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="fair"
                checked={hardcoreLevel === 'fair'}
                onChange={(e) => setHardcoreLevel(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Fair" alt="Fair Weather Rider" />
              <span>☀️ Fair Weather Rider</span>
            </label>
            <label className={`experience-option ${hardcoreLevel === 'occasional' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="occasional"
                checked={hardcoreLevel === 'occasional'}
                onChange={(e) => setHardcoreLevel(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Occasional" alt="Occasional Adventurer" />
              <span>🌤️ Occasional Adventurer</span>
            </label>
            <label className={`experience-option ${hardcoreLevel === 'hardcore' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="hardcore"
                checked={hardcoreLevel === 'hardcore'}
                onChange={(e) => setHardcoreLevel(e.target.value)}
              />
              <img src="https://via.placeholder.com/80?text=Hardcore" alt="Hardcore Adventurer" />
              <span>🌧️❄️ Hardcore Adventurer</span>
            </label>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">Next</button>
          <button type="button" className="repaint-button" onClick={handleRepaint}>Repaint</button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;