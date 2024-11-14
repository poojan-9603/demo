// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // For navigation

const Dashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [bikeCostData, setBikeCostData] = useState(null);
  const [balance, setBalance] = useState(0); // Initialize balance
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          const bikeCosts = userDoc.data().bikeCost; // Assuming bikeCost is stored in user data
          setBikeCostData(bikeCosts);
          // Calculate the total costs and set the balance
          const totalCosts = (bikeCosts.bikeInitialCost || 0) + (bikeCosts.bikeExpensePerMonth || 0) + (bikeCosts.bikeAdditionalExpense || 0);
          setBalance(-totalCosts); // Set balance as negative of total costs
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    // Implement logout functionality
    // For example, using Firebase Auth
    // auth.signOut().then(() => navigate('/login'));
    console.log('Logout functionality to be implemented');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      {userData ? (
        <div style={styles.userInfo}>
          <h2>Welcome, {userData.nickname}!</h2>
          <p>Email: {userData.email}</p>
          <h3>Bike Cost Summary</h3>
          {bikeCostData ? (
            <div style={styles.bikeCostSummary}>
              <p>Initial Cost: ${bikeCostData.bikeInitialCost}</p>
              <p>Monthly Expenses: ${bikeCostData.bikeExpensePerMonth}</p>
              <p>Additional Expenses: ${bikeCostData.bikeAdditionalExpense}</p>
              <h4>Balance: ${balance}</h4> {/* Display the balance */}
            </div>
          ) : (
            <p>No bike cost data available.</p>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
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
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#00796b', // Teal color
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  bikeCostSummary: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336', // Red color for logout
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
};

// Export the Dashboard component
export default Dashboard;