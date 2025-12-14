// src/firebase.js

// 1. Add imports for Auth and Firestore
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       // <--- ADDED
import { getFirestore } from "firebase/firestore"; // <--- ADDED

const firebaseConfig = {
    apiKey: "AIzaSyDmG84oTWDJ4gtMZdrqYULHgsRGS0mNcC8",
    authDomain: "smarthealthmonitor-a00af.firebaseapp.com",
    projectId: "smarthealthmonitor-a00af",
    storageBucket: "smarthealthmonitor-a00af.firebasestorage.app",
    messagingSenderId: "541812868488",
    appId: "1:541812868488:web:de431285221c5cb396663d",
    measurementId: "G-8EWDGBSCMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. EXPORT Auth and Database so other files can use them
export const auth = getAuth(app);      // <--- IMPORTANT!
export const db = getFirestore(app);   // <--- IMPORTANT!
export default app;