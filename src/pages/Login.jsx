// src/pages/Login.jsx
import { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// Firebase Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; 

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // We don't need 'userType' state here because we fetch it from the database!
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Recreate the fake email we used in Signup
        const emailForFirebase = `${username}@medisense.com`;

        try {
            // 2. Login with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, emailForFirebase, password);
            const user = userCredential.user;

            console.log("Logged in User ID:", user.uid);

            // 3. Fetch User Role from Firestore Database
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userRole = userData.role; // 'doctor' or 'patient'

                alert(`Login Successful! Welcome, ${userData.fullName}`);

                // 4. Redirect based on Role
                if (userRole === 'doctor') {
                    // You haven't created this page yet, but the logic is ready
                    navigate('/dashboard'); 
                } else {
                    // Go to the Patient Dashboard we built
                    navigate('/dashboard'); 
                }
            } else {
                alert("Error: User data not found in database!");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Invalid Username or Password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="header-top">
                        <img src={ logo } alt="MediSense Logo" className="login-logo" />
                        <a href="/" className="home-link">Home</a>
                    </div>
                    <p className="login-subtitle">Login to continue</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="username">Username</label>
                        <input 
                            id="username" 
                            type="text" 
                            className="input-field" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter your username" 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            className="input-field" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter your password" 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button">Login</button>

                    <button type="button" className="signup-link" onClick={() => navigate('/signup')}>
                        New? Sign up here
                    </button>
                </form>
            </div>
        </div>
    );
}