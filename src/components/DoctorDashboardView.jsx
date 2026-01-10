import React, { useState, useEffect } from 'react';
import { Calendar, Users, AlertCircle, Activity, Wifi, Moon } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const DoctorDashboardView = ({ currentUser }) => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        appointmentsToday: 12, // Placeholder
        pendingRequests: 3     // Placeholder
    });
    const [recentPatients, setRecentPatients] = useState([]);

    useEffect(() => {
        if (!currentUser?.uid) return;

        const patientsRef = collection(db, "users");
        // Query for patients assigned to this doctor
        const q = query(
            patientsRef,
            where("role", "==", "patient"),
            where("assignedDoctorId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStats(prev => ({
                ...prev,
                totalPatients: snapshot.size
            }));

            const patientsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Take first 5 patients for the recent list
            setRecentPatients(patientsList.slice(0, 5));
        });

        return () => unsubscribe();
    }, [currentUser]);

    const getPatientStatus = (p) => {
        if (p.currentVitals?.lastUpdated) {
            const lastUpdate = p.currentVitals.lastUpdated.toDate ? p.currentVitals.lastUpdated.toDate().getTime() : Date.now();
            const diff = Date.now() - lastUpdate;
            if (diff < 20000) return 'Live';
        }
        if (p.isOnline) return 'Signed In';
        return 'Offline';
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.totalPatients}</h3>
                        <p className="text-sm text-slate-500">Total Patients</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.appointmentsToday}</h3>
                        <p className="text-sm text-slate-500">Appointments Today</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.pendingRequests}</h3>
                        <p className="text-sm text-slate-500">Pending Requests</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Patients List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Recent Patients</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentPatients.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Users size={32} className="mx-auto mb-2 opacity-20" />
                                <p>No patients assigned yet.</p>
                            </div>
                        ) : (
                            recentPatients.map(patient => (
                                <div key={patient.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : 'P'}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{patient.fullName}</h4>
                                            <p className="text-xs text-slate-500">{patient.age ? `${patient.age} yrs` : 'Age N/A'} • {patient.gender || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const status = getPatientStatus(patient);
                                            if (status === 'Live') {
                                                return <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                                    <Activity size={12} className="animate-pulse" /> Live
                                                </span>;
                                            } else if (status === 'Signed In') {
                                                return <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                                                    <Wifi size={12} /> Online
                                                </span>;
                                            } else {
                                                return <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                                                    <Moon size={12} /> Offline
                                                </span>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Appointments (Static for now) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Today's Schedule</h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View Calendar</button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "Rahul Kumar", time: "10:00 AM", type: "General Checkup", status: "Upcoming" },
                            { name: "Sneha Gupta", time: "11:30 AM", type: "Follow-up", status: "In Progress" },
                            { name: "Amit Verma", time: "02:00 PM", type: "Lab Results", status: "Pending" },
                            { name: "Priya Singh", time: "04:15 PM", type: "Consultation", status: "Pending" }
                        ].map((apt, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex flex-col items-center justify-center min-w-[60px] bg-blue-50 rounded-lg py-2 px-1">
                                    <span className="text-xs font-bold text-blue-700">{apt.time.split(' ')[0]}</span>
                                    <span className="text-[10px] text-blue-500 font-medium">{apt.time.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 text-sm">{apt.name}</h4>
                                    <p className="text-xs text-slate-500">{apt.type}</p>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${apt.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardView;
