// src/pages/doTheMath.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from '../firebase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

const DoTheMath = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { cost, distance } = location.state || { cost: null, distance: null }; // Destructure cost and distance
  const [fetchedDistance, setFetchedDistance] = useState(null);
  const [caloriesCycling, setCaloriesCycling] = useState(0);
  const [caloriesRunning, setCaloriesRunning] = useState(0);
  const [carbonEmissions, setCarbonEmissions] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null); // State to track which card is hovered

  useEffect(() => {
    const fetchDistance = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid; // Get the user's ID
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document

        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const distanceFromDb = userDoc.data().distance; // Fetch distance from Firestore
            setFetchedDistance(distanceFromDb);
            calculateMetrics(distanceFromDb); // Calculate metrics based on fetched distance
          }
        } catch (error) {
          console.error('Error fetching distance: ', error.message);
        }
      }
    };

    fetchDistance();
  }, []);

  const calculateMetrics = (distance) => {
    const costPerKm = 0.5; // Example cost per kilometer
    const caloriesPerKmCycling = 50; // Average calories burned per km cycling
    const caloriesPerKmRunning = 100; // Average calories burned per km running
    const carbonPerKm = 0.1; // Example carbon emissions per km in kg

    // Calculate values
    const calculatedCost = distance * costPerKm;
    const calculatedCaloriesCycling = distance * caloriesPerKmCycling;
    const calculatedCaloriesRunning = distance * caloriesPerKmRunning;
    const calculatedCarbonEmissions = distance * carbonPerKm;

    // Set state values
    setCaloriesCycling(calculatedCaloriesCycling);
    setCaloriesRunning(calculatedCaloriesRunning);
    setCarbonEmissions(calculatedCarbonEmissions);
  };

  const handleCardClick = async (cardType) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Get the user's ID
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          let newExpenses = userData.expenses || 0;
          let newSavings = userData.savings || 0;
          let newCaloriesBurned = userData.caloriesBurned || 0;
          let newCarbonEmissionsSaved = userData.carbonEmissionsSaved || 0;

          if (cardType === 'Public Transport') {
            newExpenses += cost; // Add cost to expenses
          } else {
            newSavings += cost; // Add cost to savings
            newCaloriesBurned += cardType === 'Cycling' ? caloriesCycling : caloriesRunning; // Add calories burned
            newCarbonEmissionsSaved += carbonEmissions; // Add carbon emissions saved
          }

          // Update the user's document in Firestore
          await updateDoc(userDocRef, {
            expenses: newExpenses,
            savings: newSavings,
            caloriesBurned: newCaloriesBurned,
            carbonEmissionsSaved: newCarbonEmissionsSaved,
          });

          // Navigate back to Dashboard after updating
          navigate('/dashboard'); // Adjust the path as necessary
        }
      } catch (error) {
        console.error('Error updating user data: ', error.message);
      }
    }
  };

  return (
    <div style={{ ...styles.container }}>
      <h1 style={styles.title}>Do the Math</h1>
      <div className="car-animation">
        <div className="car"></div>
      </div>
      <div style={styles.cardsContainer}>
        <Card
          title="Public Transport"
          cost={cost}
          distance={fetchedDistance}
          carbonEmissions={carbonEmissions}
          isHovered={hoveredCard === 'Public Transport'}
          onHover={() => setHoveredCard('Public Transport')} // Set hovered card
          onMouseLeave={() => setHoveredCard(null)} // Reset hovered card
          onClick={() => handleCardClick('Public Transport')} // Handle click
        />
        <Card
          title="Cycling"
          calories={caloriesCycling}
          distance={fetchedDistance}
          isHovered={hoveredCard === 'Cycling'}
          onHover={() => setHoveredCard('Cycling')} // Set hovered card
          onMouseLeave={() => setHoveredCard(null)} // Reset hovered card
          onClick={() => handleCardClick('Cycling')} // Handle click
        />
        <Card
          title="Running"
          calories={caloriesRunning}
          distance={fetchedDistance}
          isHovered={hoveredCard === 'Running'}
          onHover={() => setHoveredCard('Running')} // Set hovered card
          onMouseLeave={() => setHoveredCard(null)} // Reset hovered card
          onClick={() => handleCardClick('Running')} // Handle click
        />
      </div>
      <style>{`
        .car-animation {
          position: relative;
          width: 100%;
          height: 100px; /* Adjust height as needed */
          overflow: hidden;
        }

        .car {
          position: absolute;
          width: 50px; /* Width of the car */
          height: 30px; /* Height of the car */
          background-color: #ff5722; /* Car color */
          border-radius: 5px; /* Rounded corners */
          animation: moveCar 3s linear infinite; /* Animation for the car */
        }

        @keyframes moveCar {
          0% {
            left: 0;
          }
          100% {
            left: calc(100% - 50px); /* Move to the right */
          }
        }

        .cardsContainer {
          display: flex;
          justify-content: space-around;
          width: 100%;
          margin-top: 40px;
        }

        .card {
          background-color: #ffffff; /* Card background */
          border: 1px solid #ccc; /* Card border */
          border-radius: 10px; /* Rounded corners */
          padding: 20px;
          width: 150px; /* Initial card width */
          height: 200px; /* Fixed height to prevent layout shifts */
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s; /* Transition for hover effect */
          cursor: pointer;
          position: relative; /* Ensure positioning for child elements */
        }

        /* Hover styles for each card */
        .card:hover {
          transform: scale(1.1); /* Scale up on hover */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Shadow effect on hover */
        }
      `}</style>
    </div>
  );
};

const Card = ({ title, cost, distance, calories, carbonEmissions, isHovered, onHover, onMouseLeave, onClick }) => {
  return (
    <div
      className="card"
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
      onClick={onClick} // Handle click
    >
      <h2 className="card-title">{title}</h2>
      {isHovered && (
        <>
          {cost !== undefined && (
            <p>Estimated Cost: ${cost.toFixed(2)}</p>
          )}
          {distance !== undefined && (
            <p>Distance: {distance ? distance.toFixed(2) : 0} km</p>
          )}
          {calories !== undefined && (
            <p>Calories Burned: {calories.toFixed(2)} kcal</p>
          )}
          {carbonEmissions !== undefined && (
            <p>Carbon Emissions: {carbonEmissions.toFixed(2)} kg</p>
          )}
        </>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa', // Light blue background
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#00796b', // Darker green for title
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '40px',
  },
};

// Export the DoTheMath component
export default DoTheMath;