import React, { useState, useEffect } from 'react';
import { Search, FileText, User, Activity, Wifi, Moon } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import PatientMonitorModal from './PatientMonitorModal';

const PatientsView = ({ currentUser }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "users");

    // --- PROCESS TO SELECT PATIENTS FOR DIFFERENT DOCTORS ---
    // Option 1 (Prototype): Fetch ALL patients.
    // let q = query(usersRef, where("role", "==", "patient"));

    // Option 2 (Strict): Fetch ONLY patients assigned to this doctor.
    // Requirement: You must add a field 'assignedDoctorId' to the patient document in Firestore.
    const q = query(usersRef, where("role", "==", "patient"), where("assignedDoctorId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Filter locally for search
  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the active patient object for the modal
  const activePatient = patients.find(p => p.id === selectedPatientId);

  // Helper to determine status
  const getPatientStatus = (p) => {
    // 1. Check for LIVE (Vitals updated in last 20 seconds)
    if (p.currentVitals?.lastUpdated) {
      const lastUpdate = p.currentVitals.lastUpdated.toDate ? p.currentVitals.lastUpdated.toDate().getTime() : Date.now();
      const diff = Date.now() - lastUpdate;
      if (diff < 20000) return 'Live';
    }
    // 2. Check for ONLINE
    if (p.isOnline) return 'Signed In';

    // 3. Default
    return 'Offline';
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>My Patients</h2>
        <div className="search-bar">
          <Search size={18} color="#888" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age/Gender</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No patients found.
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td className="fw-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                        {p.fullName ? p.fullName.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      {p.fullName || "Unknown"}
                    </div>
                  </td>
                  <td>{p.age || "N/A"} / {p.gender || "N/A"}</td>
                  {/* These fields are placeholders since they aren't in Signup yet */}
                  <td>{p.condition || "General Checkup"}</td>
                  <td>
                    {(() => {
                      const status = getPatientStatus(p);
                      if (status === 'Live') {
                        return <span className="flex w-fit items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100"><Activity size={12} className="animate-pulse" /> Live</span>;
                      } else if (status === 'Signed In') {
                        return <span className="flex w-fit items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100"><Wifi size={12} /> Signed In</span>;
                      } else {
                        return <span className="flex w-fit items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200"><Moon size={12} /> Offline</span>;
                      }
                    })()}
                  </td>
                  <td>{p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                      onClick={() => setSelectedPatientId(p.id)}
                    >
                      <Activity size={14} />
                      View Vitals
                    </button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      {/* LIVE PATIENT MONITOR MODAL */}
      {activePatient && (
        <PatientMonitorModal patient={activePatient} onClose={() => setSelectedPatientId(null)} />
      )}
    </div>
  );
};

export default PatientsView;