// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import Firestore database
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // For navigation
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth

const Dashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(0); // Initialize balance
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          console.log('Fetching user data for userId:', userId); // Log the userId
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Calculate balance as savings minus expenses
            const calculatedBalance = (data.savings || 0) - (data.expenses || 0);
            setBalance(calculatedBalance);
            console.log('Balance:', calculatedBalance); // Log balance
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        console.error('User not authenticated.');
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
        await signOut(auth); // Sign out the user
        console.log('User signed out successfully.');

        // Set sessionActive to false in Firestore
        await updateDoc(doc(db, 'users', userId), {
            sessionActive: false,
        });

        // Redirect to login page after logout
        navigate('/login'); 
    } catch (error) {
        console.error('Error signing out: ', error);
    }
};

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.nickname}>Welcome, {userData ? userData.nickname : 'User'}!</h2>
        <h4 style={styles.balance}>Balance: ${balance.toFixed(2)}</h4>
      </div>
      <div style={styles.mainContent}>
        <h3 style={styles.slogan}>Your journey to smarter biking starts here!</h3>
        <div style={styles.buttonContainer}>
          <button style={styles.fancyButton} onClick={() => navigate('/public-transport')}>View Public Transport</button>
          <button style={styles.fancyButton} onClick={() => navigate('/taxi')}>View Taxi Options</button>
          <button style={styles.fancyButton} onClick={() => navigate('/ran')}>View Running Options</button>
        </div>
        <h2 style={styles.whatIf}>What if I...</h2>
        <div style={styles.scenarioButtons}>
          <button style={styles.scenarioButton} onClick={() => navigate('/public-transport')}>Took Public Transport</button>
          <button style={styles.scenarioButton} onClick={() => navigate('/taxi')}>Took a Taxi</button>
          <button style={styles.scenarioButton} onClick={() => navigate('/ran')}>Ran to it</button>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#e0f7fa', // Light blue background
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#00796b', // Darker green for sidebar
    color: '#fff',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  nickname: {
    margin: '0',
  },
  balance: {
    margin: '10px 0',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
  },
  slogan: {
    fontSize: '1.5rem',
    color: '#00796b',
    margin: '20px 0',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  fancyButton: {
    padding: '10px 20px',
    backgroundColor: '#00796b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    margin: '5px 0',
    transition: 'background-color 0.3s',
  },
  whatIf: {
    marginTop: '30px',
    fontSize: '1.5rem',
    color: '#00796b',
  },
  scenarioButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  scenarioButton: {
    padding: '10px 20px',
    backgroundColor: '#ffa726',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    margin: '5px 0',
    transition: 'background-color 0.3s',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
};

// Export the Dashboard component
export default Dashboard;