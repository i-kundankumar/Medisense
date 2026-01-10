import React, { useState, useEffect } from 'react';
import { Search, FileText, User } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const PatientsView = ({ currentUser }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "users");

    // --- PROCESS TO SELECT PATIENTS FOR DIFFERENT DOCTORS ---
    // Option 1 (Prototype): Fetch ALL patients.
    let q = query(usersRef, where("role", "==", "patient"));

    // Option 2 (Strict): Fetch ONLY patients assigned to this doctor.
    // Requirement: You must add a field 'assignedDoctorId' to the patient document in Firestore.
    // q = query(usersRef, where("role", "==", "patient"), where("assignedDoctorId", "==", currentUser.uid));

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
                    <span className={`status-badge ${p.status ? p.status.toLowerCase() : 'outpatient'}`}>
                      {p.status || "Active"}
                    </span>
                  </td>
                  <td>{p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button className="icon-btn"><FileText size={18} /></button>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsView;