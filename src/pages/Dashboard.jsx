// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, LogOut, Activity, BarChart3,
  MessageSquare, Clock, CheckCircle2, AlertCircle,
  Share2 // Icons for Patient Vitals
} from 'lucide-react';

// Firebase Imports
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import './Dashboard.css'; // Make sure this CSS file exists
import logo from "../assets/logo.png";

// Sub-components
import PatientsView from '../components/PatientsView';
import AppointmentsView from '../components/AppointmentsView';
import MessagesView from '../components/MessagesView';
import ShareDataView from '../components/ShareDataView';
import MyVitalsView from '../components/MyVitalsView';
import HistoryView from '../components/HistoryView';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. FETCH REAL USER ROLE FROM FIREBASE
  useEffect(() => {
    let unsubscribeUserDoc = () => { };

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      // Always unsubscribe previous listener if auth state changes
      unsubscribeUserDoc();

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        // Use onSnapshot for real-time updates (e.g. when connecting to a doctor)
        unsubscribeUserDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...docSnap.data(), uid: currentUser.uid });
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        navigate('/login');
        setLoading(false);
      }
    });

    return () => { unsubscribeAuth(); unsubscribeUserDoc(); };
  }, [navigate]);

  // 2. CLOCK & PATIENT SIMULATION LOOP
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 2000);

    return () => clearInterval(timer);
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // --- RENDER CONTENT: DOCTOR ---
  const renderDoctorContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon-bg"><Calendar size={24} color="#2563eb" /></div>
              <div><h3>12</h3><p>Appointments Today</p></div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon-bg orange-bg"><AlertCircle size={24} color="#ea580c" /></div>
              <div><h3>3</h3><p>Pending Requests</p></div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon-bg green-bg"><CheckCircle2 size={24} color="#16a34a" /></div>
              <div><h3>28</h3><p>Total Patients</p></div>
            </div>
          </div>
        );
      case 'patients': return <PatientsView currentUser={user} />;
      case 'appointments': return <AppointmentsView />;
      case 'message': return <MessagesView currentUser={user} />;
      default: return <div>Select an option</div>;
    }
  };

  // --- RENDER CONTENT: PATIENT ---
  const renderPatientContent = () => {
    switch (activeNav) {
      case 'message':
        return <MessagesView currentUser={user} />;
      case 'share':
        return <ShareDataView currentUser={user} />;
      case 'history':
        return <HistoryView currentUser={user} />;
      case 'dashboard':
      default:
        return <MyVitalsView currentUser={user} setActiveNav={setActiveNav} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content"><div className="spinner"></div><p>Loading...</p></div>
      </div>
    );
  }

  // Define Menu Items based on Role
  const doctorNav = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'patients', label: 'My Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'message', label: 'Messages', icon: MessageSquare },
  ];

  const patientNav = [
    { id: 'dashboard', label: 'My Vitals', icon: Activity },
    { id: 'history', label: 'History', icon: Calendar }, // Placeholder
    { id: 'message', label: 'Consult Doctor', icon: MessageSquare },
    { id: 'share', label: 'Share Data', icon: Share2 },
  ];

  const navItems = user?.role === 'doctor' ? doctorNav : patientNav;

  return (
    <div className="doctor-dashboard">
      {/* Sidebar (Common for both, but items change) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="MediSense Logo" style={{ width: '200px', height: 'auto', objectFit: 'contain' }} />
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-info">
              <div className="user-avatar">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div className="user-details">
                <p className="user-name">{user?.fullName || 'User'}</p>
                <p className="user-role" style={{ textTransform: 'capitalize' }}>{user?.role || 'Member'}</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="dashboard-header">
            <div className="header-top-dash">
              <div className="header-title-dash">
                <h1>Hello, {user?.role === 'doctor' ? 'Dr. ' : ''}{user?.fullName?.split(' ')[0]}! 👋</h1>
                <p>{user?.role === 'doctor' ? "Here's your daily overview" : "Here are your live health vitals"}</p>
              </div>
              <div className="time-display">
                <div className="time-icon"><Clock size={18} /></div>
                <div>
                  <p className="time-label">Current Time</p>
                  <p className="time-value">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dynamic-content">
            {user?.role === 'doctor' ? renderDoctorContent() : renderPatientContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;