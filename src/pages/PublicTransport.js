// src/pages/PublicTransport.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Import Firestore
import { collection, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import './PublicTransport.css'; // Import the CSS file

const PublicTransport = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [cost, setCost] = useState(null);
  const [distance, setDistance] = useState(null); // New state for distance
  const [error, setError] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const navigate = useNavigate();

  // Function to fetch total bike costs
  const fetchTotalBikeCosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bikeCosts')); // Assuming you have a collection for bike costs
      let totalCost = 0;
      querySnapshot.forEach((doc) => {
        totalCost += doc.data().cost; // Assuming each document has a 'cost' field
      });
      return totalCost; // Return total bike costs
    } catch (error) {
      console.error('Error fetching bike costs: ', error.message);
      return 0; // Return 0 in case of error
    }
  };

  const calculateDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  const calculateCostAndDistance = async () => {
    if (!source || !destination) {
      setError('Please enter both source and destination.');
      return;
    }

    setError('');

    // Fetch coordinates for source
    const sourceResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(source)}&format=json`);
    const sourceData = await sourceResponse.json();

    // Fetch coordinates for destination
    const destinationResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json`);
    const destinationData = await destinationResponse.json();

    if (sourceData.length === 0 || destinationData.length === 0) {
      setError('Could not find one or both locations.');
      return;
    }

    const coords1 = { lat: parseFloat(sourceData[0].lat), lon: parseFloat(sourceData[0].lon) };
    const coords2 = { lat: parseFloat(destinationData[0].lat), lon: parseFloat(destinationData[0].lon) };

    const distanceValue = calculateDistance(coords1, coords2);
    const costPerKm = 0.5; // Example cost per kilometer
    const costValue = distanceValue * costPerKm; // Calculate cost

    setCost(costValue); // Set the calculated cost to state
    setDistance(distanceValue); // Set the calculated distance to state

    // Update the user's document in Firestore with the distance
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the user's ID
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document

      try {
        await updateDoc(userDocRef, {
          distance: distanceValue // Store the distance in the user's document
        });
        console.log(`Distance of ${distanceValue} km stored in the database.`);
      } catch (error) {
        console.error('Error updating distance: ', error.message);
        setError('Failed to update distance. Please try again.'); // Set error state for user feedback
      }
    } else {
      setError('User not authenticated. Please log in.');
    }

    // Navigate to DoTheMath with state
    navigate('/doTheMath', { state: { cost: costValue, distance: distanceValue } });
  };

  const handleAddToSavings = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the user's ID
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document

      try {
        // Update the user's savings and balance
        await updateDoc(userDocRef, {
          savings: increment(cost), // Increment the savings by the cost
          balance: increment(cost) // Update balance as well
        });

        console.log(`Added ${cost} to savings.`);
        navigate('/dashboard'); // Navigate back to the dashboard
      } catch (error) {
        console.error('Error updating savings: ', error.message); // Log the error message
        setError('Failed to update savings. Please try again.'); // Set error state for user feedback
      }
    } else {
      setError('User not authenticated. Please log in.');
    }
  };

  const handleInitializeExpenses = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the user's ID
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document

      try {
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          console.error('User document does not exist.');
          return;
        }

        const expenses = userDoc.data().expenses || 0; // Get existing expenses or default to 0
        if (expenses === 0) {
          const totalBikeCosts = await fetchTotalBikeCosts();
          await updateDoc(userDocRef, {
            expenses: totalBikeCosts, // Set initial expenses to total bike costs
            balance: -totalBikeCosts // Initialize balance as negative expenses
          });

          console.log(`Initialized expenses to ${totalBikeCosts}.`);
        }
      } catch (error) {
        console.error('Error initializing expenses: ', error.message); // Log the error message
        setError('Failed to initialize expenses. Please try again.'); // Set error state for user feedback
      }
    } else {
      setError('User not authenticated. Please log in.');
    }
  };

  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === 'source') setSourceSuggestions([]);
      if (type === 'destination') setDestinationSuggestions([]);
      return;
    }

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
    const data = await response.json();

    if (type === 'source') {
      setSourceSuggestions(data);
    } else {
      setDestinationSuggestions(data);
    }
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    fetchSuggestions(e.target.value, 'source');
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions(e.target.value, 'destination');
  };

  const handleSuggestionClick = (place, type) => {
    if (type === 'source') {
      setSource(place.display_name);
      setSourceSuggestions([]);
    } else {
      setDestination(place.display_name);
      setDestinationSuggestions([]);
    }
  };

  // Call handleInitializeExpenses when the component mounts
  useEffect(() => {
    handleInitializeExpenses();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Calculate Public Transport Cost</h1>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Enter Source"
          value={source}
          onChange={handleSourceChange}
          className="input"
        />
        {sourceSuggestions.length > 0 && (
          <ul className="suggestions">
            {sourceSuggestions.map((place) => (
              <li key={place.place_id} onClick={() => handleSuggestionClick(place, 'source')} className="suggestionItem">
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={handleDestinationChange}
          className="input"
        />
        {destinationSuggestions.length > 0 && (
          <ul className="suggestions">
            {destinationSuggestions.map((place) => (
              <li key={place.place_id} onClick={() => handleSuggestionClick(place, 'destination')} className="suggestionItem">
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        <button onClick={calculateCostAndDistance} className="doMathButton">Do the Math</button>
      </div>
      {error && <p className="error">{error}</p>}
      {cost !== null && (
        <div className="resultContainer">
          <h2 className="resultTitle">Estimated Cost: ${cost.toFixed(2)}</h2>
          <h2 className="resultTitle">Distance: {distance ? distance.toFixed(2) : 0} km</h2>
        </div>
      )}
    </div>
  );
};

// Export the PublicTransport component
export default PublicTransport;