import React, { useState, useEffect } from 'react';
import { User, Share2, Activity, History, Check, Shield } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const ShareDataView = ({ currentUser }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // State to track current sharing settings
    const [assignedDoctorId, setAssignedDoctorId] = useState(currentUser?.assignedDoctorId || null);
    const [permissions, setPermissions] = useState(currentUser?.sharingPermissions || { live: false, history: false });

    // 1. Fetch All Doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const q = query(collection(db, "users"), where("role", "==", "doctor"));
                const querySnapshot = await getDocs(q);
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDoctors(docs);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // 2. Handle Connecting to a Doctor
    const handleConnect = async (doctorId) => {
        try {
            const userRef = doc(db, "users", currentUser.uid);

            // Default permissions when connecting
            const initialPermissions = { live: true, history: true };

            await updateDoc(userRef, {
                assignedDoctorId: doctorId,
                sharingPermissions: initialPermissions
            });

            setAssignedDoctorId(doctorId);
            setPermissions(initialPermissions);
            alert("Connected to doctor successfully!");
        } catch (error) {
            console.error("Error connecting:", error);
            alert("Failed to connect. Please try again.");
        }
    };

    // 3. Handle Toggling Permissions (Live / History)
    const handleToggle = async (type) => {
        if (!assignedDoctorId) return;

        const newPermissions = { ...permissions, [type]: !permissions[type] };

        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                sharingPermissions: newPermissions
            });
            setPermissions(newPermissions);
        } catch (error) {
            console.error("Error updating permissions:", error);
            // Revert state on error
            alert("Failed to update permission.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading doctors...</div>;

    return (
        <div className="view-container">
            <div className="view-header">
                <h2>Share Health Data</h2>
                <p className="text-sm text-gray-500">Select a doctor to share your vitals with.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {doctors.map((doc) => {
                    const isConnected = assignedDoctorId === doc.id;

                    return (
                        <div
                            key={doc.id}
                            className={`p-4 rounded-xl border transition-all ${isConnected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {doc.fullName ? doc.fullName.charAt(0).toUpperCase() : <User size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{doc.fullName}</h4>
                                        <p className="text-xs text-gray-500">{doc.registrationId ? `Reg: ${doc.registrationId}` : 'Specialist'}</p>
                                    </div>
                                </div>
                                {isConnected && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"><Check size={12} /> Connected</span>}
                            </div>

                            {isConnected ? (
                                <div className="space-y-3 pt-2 border-t border-blue-100">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Data Access</p>

                                    {/* Share Live Data Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Activity size={16} className={permissions.live ? "text-green-500" : "text-gray-400"} />
                                            <span>Share Live Vitals</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={permissions.live} onChange={() => handleToggle('live')} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    {/* Share Past Data Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <History size={16} className={permissions.history ? "text-purple-500" : "text-gray-400"} />
                                            <span>Share Past History</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={permissions.history} onChange={() => handleToggle('history')} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleConnect(doc.id)}
                                    className="w-full mt-2 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Share2 size={16} /> Connect & Share
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShareDataView;
