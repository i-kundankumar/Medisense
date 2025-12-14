import { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png"; 

// Firebase Imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "../firebase"; 

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: 'doctor',
    fullName: '',
    username: '', 
    password: '',
    registrationId: '',
    age: '',
    gender: 'Male',
    agreeToTerms: false,
    communicationPreference: {} 
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'agreeToTerms') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        communicationPreference: { ...prev.communicationPreference, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // --- 1. VALIDATION CHECKS (Make Everything Required) ---
    
    // Check Common Fields
    if (!formData.fullName.trim()) { alert("Please enter your Full Name."); return; }
    if (!formData.username.trim()) { alert("Please enter a Username."); return; }
    if (!formData.password) { alert("Please enter a Password."); return; }
    
    // Check Doctor Specifics
    if (formData.role === 'doctor') {
        if (!formData.registrationId.trim()) { alert("Doctors must provide a Registration ID / License Number."); return; }
    }

    // Check Patient Specifics
    if (formData.role === 'patient') {
        if (!formData.age) { alert("Please enter your Age."); return; }
    }

    // Check Terms
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and privacy policy.');
      return;
    }

    // --- 2. FIREBASE LOGIC (Only runs if checks pass) ---
    const emailForFirebase = `${formData.username}@medisense.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        emailForFirebase, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log("Firebase Auth Success:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        username: formData.username, 
        role: formData.role,
        gender: formData.gender,
        ...(formData.role === 'doctor' 
            ? { registrationId: formData.registrationId } 
            : { age: formData.age }
        ),
        createdAt: new Date()
      });

      alert("Account Created Successfully!");
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("This username is already taken. Please choose another.");
      } else if (error.code === 'auth/weak-password') {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="header-top">
            <img src={logo} alt="MediSense Logo" className="login-logo" />
            <a href="/" className="home-link">Home</a>
          </div>
          <p className="login-subtitle">Signup to continue</p>
        </div>

        <div className="signup-form">
          {/* Role Selection */}
          <div className="radio-group">
            <label className="input-label">Select Role: <span style={{color:'red'}}>*</span></label>
            <div className="radio-options">
              <label className="radio-option">
                <input
                  type="radio" name="role" value="doctor" className="radio-input"
                  checked={formData.role === 'doctor'} onChange={handleInputChange}
                />
                <span className="radio-text">Doctor</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio" name="role" value="patient" className="radio-input"
                  checked={formData.role === 'patient'} onChange={handleInputChange}
                />
                <span className="radio-text">Patient</span>
              </label>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Full Name <span style={{color:'red'}}>*</span></label>
            <input
              type="text" name="fullName" className="input-field"
              value={formData.fullName} onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Username <span style={{color:'red'}}>*</span></label>
            <input
              type="text" name="username" className="input-field"
              value={formData.username} onChange={handleInputChange}
              placeholder="Choose a username"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password <span style={{color:'red'}}>*</span></label>
            <input
              type="password" name="password" className="input-field"
              value={formData.password} onChange={handleInputChange}
              placeholder="Create a password"
            />
          </div>

          {/* Conditional Logic for Role */}
          {formData.role === 'doctor' && (
            <div className="input-group">
              <label className="input-label">Registration ID <span style={{color:'red'}}>*</span></label>
              <input
                type="text" name="registrationId" className="input-field"
                value={formData.registrationId} onChange={handleInputChange}
                placeholder="Medical license number"
              />
            </div>
          )}

          {formData.role === 'patient' && (
            <>
              <div className="input-group">
                <label className="input-label">Age <span style={{color:'red'}}>*</span></label>
                <input
                  type="number" name="age" className="input-field"
                  value={formData.age} onChange={handleInputChange}
                  placeholder="Enter your age"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Gender <span style={{color:'red'}}>*</span></label>
                <select name="gender" className="select-field" value={formData.gender} onChange={handleInputChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="terms-group">
            <input
              type="checkbox" name="agreeToTerms" className="checkbox-input"
              checked={formData.agreeToTerms} onChange={handleInputChange}
            />
            <label className="checkbox-label">I agree to the terms.</label>
          </div>

          <button onClick={handleSubmit} className="signup-button">Create Account</button>
          
          <button className="login-link" onClick={() => navigate('/login')}>
            Already have an account? Login here
          </button>
        </div>
      </div>
    </div>
  );
}