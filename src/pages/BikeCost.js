// src/pages/BikeCost.js
import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { doc, updateDoc, increment } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const BikeCost = ({ userId }) => {
  const [bikePrice, setBikePrice] = useState(1); // Initialize bikePrice as a number
  const [monthlyExpenses, setMonthlyExpenses] = useState(0); // Initialize monthlyExpenses as a number
  const [anonymousExpense, setAnonymousExpense] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to hold the bike cost data
    const bikeCostData = {
      bikeInitialCost: parseFloat(bikePrice), // Save bike price as bikeInitialCost
      bikeExpensePerMonth: parseFloat(monthlyExpenses), // Save monthly expenses as bikeExpensePerMonth
      bikeAdditionalExpense: parseFloat(anonymousExpense || 0), // Save anonymous expense as bikeAdditionalExpense
    };

    // Calculate total expenses to update in Firestore
    const totalExpenses = bikeCostData.bikeInitialCost + bikeCostData.bikeExpensePerMonth + bikeCostData.bikeAdditionalExpense;

    // Update the user's document in Firestore with the bike cost data and expenses
    try {
      const userDocRef = doc(db, 'users', userId); // Reference to the user's document
      await updateDoc(userDocRef, {
        bikeCost: bikeCostData, // Update the document with bike cost data
        expenses: increment(totalExpenses) // Increment the expenses by the total expenses calculated
      });
      alert('Bike cost data saved successfully!');

      // Navigate to the Dashboard after saving
      navigate('/dashboard'); // Adjust the path as necessary
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('There was an error saving your bike cost data. Please try again.');
    }
  };

  // Function to determine the emoji based on bike price
  const getPriceEmoji = () => {
    if (bikePrice < 3000) {
      return '🚲'; // Standard bike
    } else if (bikePrice < 7000) {
      return '🚴‍♂️'; // Expensive bike
    } else {
      return '🚵‍♀️'; // Luxury bike
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚴 Bike Cost Estimator</h1>
      <p style={styles.description}>Let's calculate the total cost of owning your bike!</p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="bikePrice" style={styles.label}>
            💲 Price of the Bike (in USD): {getPriceEmoji()}
          </label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              id="bikePrice"
              min="1"
              max="10000"
              value={bikePrice}
              onChange={(e) => setBikePrice(e.target.value)}
              style={styles.slider}
            />
            <div style={styles.priceDisplay}>${bikePrice}</div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="monthlyExpenses" style={styles.label}>🛠️ Monthly Maintenance Expenses (in USD):</label>
          <div style={styles.sliderContainer}>
            <input
              type="range"
              id="monthlyExpenses"
              min="0"
              max="1000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              style={styles.slider}
            />
            <div style={styles.priceDisplay}>${monthlyExpenses}</div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="anonymousExpense" style={styles.label}>🤫 Optional Anonymous Expense (in USD):</label>
          <div style={styles.inputContainer}>
            <span style={styles.inputIcon}>$</span>
            <input
              type="number"
              id="anonymousExpense"
              value={anonymousExpense}
              onChange={(e) => setAnonymousExpense(e.target.value)}
              style={styles.fancyInput} // Updated style for fancy input
              placeholder="Optional"
            />
          </div>
        </div>

        <button type="submit" style={styles.submitButton}>💾 Save My Costs</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa', // Light blue background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#00796b', // Teal color
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#004d40', // Darker teal
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '1.1rem',
    marginBottom: '5px',
    color: '#00796b', // Teal color
  },
  slider: {
    width: '100%',
    height: '20px', // Increased height for the slider
    margin: '10px 0',
    cursor: 'pointer',
    appearance: 'none', // Remove default styling
    background: '#00796b', // Background color of the slider
    borderRadius: '5px',
  },
  priceDisplay: {
    fontSize: '1.2rem',
    color: '#00796b',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9', // Light background for the input
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
};

// Export the BikeCost component
export default BikeCost;