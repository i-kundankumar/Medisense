# 🏥 Smart IoT-Based Health Care Monitoring System

A modern, role-based health monitoring platform built with **React + Vite** and **Firebase**. This application allows **Patients** to view their real-time health vitals (Heart Rate, SpO₂, Temperature) and **Doctors** to manage appointments and view patient lists via a centralized dashboard.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 🚀 Features

### 🔐 Authentication & Roles
* **Secure Login/Signup** using Firebase Authentication.
* **Role-Based Access Control (RBAC):**
    * **Doctors:** Access a dashboard with appointment schedules, patient lists, and stats.
    * **Patients:** Access a dashboard with live health simulation and history graphs.
* **"Username" Login:** Custom logic to allow login via Username instead of Email.

### 🩺 Patient Dashboard
* **Live Vitals Simulation:** Simulates IoT sensor data (Heart Rate, SpO₂, Temp) in real-time.
* **Visual Alerts:** Color-coded cards (Green/Orange/Red) for Normal, Warning, and Critical statuses.
* **Real-Time Graph:** Live charting of health trends using **Recharts**.

### 👨‍⚕️ Doctor Dashboard
* **Appointment Management:** Calendar view and list of upcoming visits.
* **Patient Records:** Searchable list of assigned patients with status badges.
* **Chat Interface:** UI for messaging patients/staff (Frontend ready).

---

## 🛠️ Tech Stack

* **Frontend:** [React.js](https://reactjs.org/) (Vite)
* **Styling:** CSS Modules / Tailwind CSS (Optional)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Charts:** [Recharts](https://recharts.org/)
* **Backend (Serverless):** [Firebase](https://firebase.google.com/)
    * **Auth:** Email/Password Handling
    * **Firestore:** NoSQL Database for User Roles & Data storage
* **Deployment:** Vercel

---


## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
* Node.js installed (v16 or higher)
* A Firebase Project (Free tier)

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/health-monitor-iot.git](https://github.com/YOUR_USERNAME/health-monitor-iot.git)

# Navigate to the project folder
cd health-monitor-iot

# Install dependencies
npm install
```

### 3. Firebase Configuration
Go to Firebase Console.

Create a new project.

Enable Authentication (Email/Password).

Enable Firestore Database (Start in Test Mode).

Copy your web app configuration keys.

Create a file named src/firebase.js and paste your keys:

JavaScript
```
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```
### 4. Run the App
```
npm run dev
Open http://localhost:5173 in your browser.
```
### 📂 Project Structure
```
src/
├── assets/          # Images and Logos
├── components/      # Reusable components
│   ├── AppointmentsView.jsx
│   ├── MessagesView.jsx
│   └── PatientsView.jsx
├── pages/           # Main Page Views
│   ├── Dashboard.jsx       # Unified Dashboard (Doctor/Patient Logic)
│   ├── Login.jsx
│   └── Signup.jsx
├── App.jsx          # Routing Logic
├── firebase.js      # Firebase Config
└── main.jsx         # Entry Point
```
### 🔮 Future Scope (IoT Integration)
The current version uses a Simulation Engine to generate health data. The next phase involves integrating hardware:

Hardware: ESP32 Microcontroller.

Sensors: MAX30102 (HR/SpO₂), DS18B20 (Temperature).

Flow: ESP32 → Firebase Realtime Database → React Dashboard.

### 🤝 Contributing
Fork the repository.

Create a new Branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

### 📝 License
This project is licensed under the MIT License.