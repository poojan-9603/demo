// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth functions
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from '../firebase'; // Import Firestore instance

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate for navigation
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the user ID

      // Update Firestore to set sessionActive to true
      await updateDoc(doc(db, "users", userId), {
        sessionActive: true,
      });

      console.log('Login successful! Navigating to Dashboard.');
      navigate('/dashboard', { state: { userId } }); // Redirect to Dashboard.js
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.message); // Show error message
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h1 style={styles.loginTitle}>Login</h1>
      <form style={styles.loginForm} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Login</button>
        <p style={styles.link}>
          Don't have an account? <Link to="/create-account">Create Account</Link>
        </p>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  loginTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  link: {
    marginTop: '10px',
    textAlign: 'center',
  },
};

// Export the LoginPage component
export default LoginPage;