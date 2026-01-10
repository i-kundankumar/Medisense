import React, { useState, useEffect } from 'react';
import { Calendar, Download, Activity, Thermometer, Droplets, Wind } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const HistoryView = ({ currentUser }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        if (!currentUser?.uid) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const historyRef = collection(db, "users", currentUser.uid, "vitalsHistory");

                // Fetch last 50 records, newest first
                const q = query(historyRef, orderBy("timestamp", "desc"), limit(50));

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setHistoryData(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [currentUser]);

    // Client-side date filtering
    const filteredData = historyData.filter(item => {
        if (!filterDate) return true;
        if (!item.timestamp) return false;

        // Handle Firestore Timestamp or standard Date
        const itemDate = item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
        const filter = new Date(filterDate);

        return itemDate.getDate() === filter.getDate() &&
            itemDate.getMonth() === filter.getMonth() &&
            itemDate.getFullYear() === filter.getFullYear();
    });

    return (
        <div className="view-container">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Health History</h2>
                    <p className="text-sm text-slate-500">Archive of your recorded vitals and snapshots.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="date"
                            className="pl-3 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-600"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700 shadow-sm transition-colors">
                        <Download size={16} />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Date & Time</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Record Type</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Heart Rate</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">SpO2</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Body Temp</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Room Temp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12 text-slate-400">Loading history records...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12 text-slate-400">No records found for this period.</td></tr>
                            ) : (
                                filteredData.map((record) => (
                                    <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                                        <td className="py-4 px-6 text-sm text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {record.readableTime || "Unknown"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${record.type === 'manual_snapshot'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {record.type === 'manual_snapshot' ? 'Snapshot' : 'Auto-Log'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <Activity size={14} className="text-rose-500" />
                                                {record.heartRate} <span className="text-slate-400 font-normal text-xs">bpm</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <Droplets size={14} className="text-sky-500" />
                                                {record.spo2}<span className="text-slate-400 font-normal text-xs">%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <Thermometer size={14} className="text-amber-500" />
                                                {record.bodyTemp}<span className="text-slate-400 font-normal text-xs">°C</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                <Wind size={14} className="text-teal-500" />
                                                {record.roomTemp}<span className="text-slate-400 font-normal text-xs">°C</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
