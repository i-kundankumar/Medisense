// src/firebase.js

// 1. Add imports for Auth and Firestore
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // <--- ADDED
import { getFirestore } from "firebase/firestore"; // <--- ADDED

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: `${import.meta.env.VITE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. EXPORT Auth and Database so other files can use them
export const auth = getAuth(app);      // <--- IMPORTANT!
export const db = getFirestore(app);   // <--- IMPORTANT!
export default app;