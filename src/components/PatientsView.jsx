import React, { useState, useEffect } from 'react';
import { Search, FileText, User, Activity, Wifi, Moon, MessageSquare, Pill } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import PatientMonitorModal from './PatientMonitorModal';
import PrescribeModal from './PrescribeModal';

const PatientsView = ({ currentUser, onMessageClick }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [prescribingPatient, setPrescribingPatient] = useState(null);

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
    if (p.isOnline) return 'Online';

    // 3. Default
    return 'Offline';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Patients</h2>
          <p className="text-sm text-slate-500">Manage and monitor patient status</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search patients..."
            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-full sm:w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Age/Gender</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Condition</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Joined</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold shadow-sm border border-blue-200">
                          {p.fullName ? p.fullName.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <span className="font-semibold text-slate-900">{p.fullName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">{p.age || "N/A"} / {p.gender || "N/A"}</td>
                    {/* These fields are placeholders since they aren't in Signup yet */}
                    <td className="py-4 px-6 text-sm text-slate-600">{p.condition || "General Checkup"}</td>
                    <td className="py-4 px-6">
                      {(() => {
                        const status = getPatientStatus(p);
                        if (status === 'Live') {
                          return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100"><Activity size={12} className="animate-pulse" /> Live</span>;
                        } else if (status === 'Online') {
                          return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100"><Wifi size={12} /> Online</span>;
                        } else {
                          return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200"><Moon size={12} /> Offline</span>;
                        }
                      })()}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">{p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                          onClick={() => setSelectedPatientId(p.id)}
                        >
                          <Activity size={14} />
                          View Vitals
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
                          onClick={() => setPrescribingPatient(p)}
                        >
                          <Pill size={14} />
                          Prescribe
                        </button>
                        <button
                          className="flex items-center justify-center px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
                          onClick={() => onMessageClick && onMessageClick(p)}
                          title="Message"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE PATIENT MONITOR MODAL */}
      {activePatient && (
        <PatientMonitorModal patient={activePatient} onClose={() => setSelectedPatientId(null)} />
      )}

      {/* PRESCRIPTION MODAL */}
      {prescribingPatient && (
        <PrescribeModal
          patient={prescribingPatient}
          currentUser={currentUser}
          onClose={() => setPrescribingPatient(null)}
        />
      )}
    </div>
  );
};

export default PatientsView;