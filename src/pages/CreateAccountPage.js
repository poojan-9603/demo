// src/pages/CreateAccountPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth functions
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from '../firebase'; // Import the Firestore instance

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate for navigation
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        sessionActive: false, // Initialize sessionActive
      });

      console.log('Account created successfully! Navigating to HomePage.');
      navigate('/home'); // Redirect to HomePage after successful account creation
    } catch (error) {
      console.error('Error creating account:', error);
      alert(error.message); // Show error message
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Account</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create Account</button>
        <p style={styles.link}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

// Simple styles for the create account page
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  title: {
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  link: {
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default CreateAccountPage;