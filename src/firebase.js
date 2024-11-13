// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhW3oQ7UeK7QZsIUuVaPwiTBvOfydvsoA",
  authDomain: "project-484-cc7bd.firebaseapp.com",
  projectId: "project-484-cc7bd",
  storageBucket: "project-484-cc7bd.appspot.com",
  messagingSenderId: "874316247132",
  appId: "1:874316247132:web:a8495204ce1377cf997699"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; // Export both app and db