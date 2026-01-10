import React, { useState, useEffect, useRef } from 'react';
import { Heart, Thermometer, Droplets, Share2, Activity, Wind, Zap, Settings, AlertCircle, Play, Square, Save } from 'lucide-react';
import { Area, AreaChart, ComposedChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

const MyVitalsView = ({ currentUser, setActiveNav }) => {
    // --- STATE FOR PATIENT VITALS (Simulation) ---
    const [vitals, setVitals] = useState({
        heartRate: Math.floor(Math.random() * (100 - 60) + 60),
        spo2: Math.floor(Math.random() * (100 - 94) + 94),
        bodyTemp: (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1),
        roomTemp: (Math.random() * (26.0 - 22.0) + 22.0).toFixed(1),
        ecg: 'Normal'
    });

    // --- RECORDING / UPLOAD STATE ---
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            setElapsedTime(0);
        } else {
            setIsRecording(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Helper to check sharing status
    const isSharingLive = currentUser?.assignedDoctorId && currentUser?.sharingPermissions?.live;

    // Ref to track last history save time to prevent excessive writes
    const lastHistorySave = useRef(0);

    // Initialize with dummy data so the chart isn't empty on load
    const [history, setHistory] = useState(() => {
        const data = [];
        const now = new Date();
        for (let i = 20; i >= 0; i--) {
            const t = new Date(now.getTime() - i * 1000);
            data.push({
                time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                hr: Math.floor(Math.random() * (100 - 60) + 60),
                spo2: Math.floor(Math.random() * (100 - 94) + 94),
                bodyTemp: parseFloat((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)),
                roomTemp: parseFloat((Math.random() * (26.0 - 22.0) + 22.0).toFixed(1))
            });
        }
        return data;
    });

    // --- ECG DUMMY DATA STATE ---
    const [ecgData, setEcgData] = useState(() => {
        // Generate initial 100 points of flat-ish line
        return Array.from({ length: 60 }, (_, i) => ({ time: i, value: 50 }));
    });

    // --- MANUAL SNAPSHOT ---
    const handleSaveSnapshot = async () => {
        if (!currentUser?.uid) return;
        try {
            await addDoc(collection(db, "users", currentUser.uid, "vitalsHistory"), {
                ...vitals,
                timestamp: serverTimestamp(),
                readableTime: new Date().toLocaleString(),
                type: 'manual_snapshot'
            });
            alert("Snapshot saved to your history.");
        } catch (error) {
            console.error("Error saving snapshot:", error);
        }
    };

    // 1. SIMULATION ENGINE (Generates Data)
    useEffect(() => {
        const timer = setInterval(() => {
            // Simulate Vitals
            const newHR = Math.floor(Math.random() * (100 - 60) + 60);
            const newSpO2 = Math.floor(Math.random() * (100 - 94) + 94);
            const newBodyTemp = parseFloat((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1));
            const newRoomTemp = parseFloat((Math.random() * (26.0 - 22.0) + 22.0).toFixed(1));

            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            setVitals({
                heartRate: newHR,
                spo2: newSpO2,
                bodyTemp: newBodyTemp,
                roomTemp: newRoomTemp,
                ecg: 'Normal'
            });

            setHistory(prev => {
                const newHistory = [...prev, {
                    time: timeStr,
                    hr: newHR,
                    spo2: newSpO2,
                    bodyTemp: newBodyTemp,
                    roomTemp: newRoomTemp
                }];
                return newHistory.slice(-20); // Keep last 20 points
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 2. UPLOAD ENGINE (Handles Firestore Writes)
    useEffect(() => {
        if (!isRecording || !currentUser?.uid) return;

        const handleUpload = async () => {
            const now = Date.now();

            // A. Update Live Node (Real-time, every second) - ONLY IF SHARING
            if (isSharingLive) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, {
                        currentVitals: {
                            ...vitals,
                            lastUpdated: serverTimestamp()
                        }
                    });
                } catch (e) {
                    console.error("Error updating live vitals:", e);
                }
            }

            // B. Save History (Throttled ~5s)
            if (now - lastHistorySave.current >= 5000) {
                try {
                    await addDoc(collection(db, "users", currentUser.uid, "vitalsHistory"), {
                        ...vitals,
                        timestamp: serverTimestamp(),
                        readableTime: new Date().toLocaleString()
                    });
                    lastHistorySave.current = now;
                } catch (error) {
                    console.error("Error saving vitals history:", error);
                }
            }
        };

        handleUpload();
    }, [vitals, isRecording, currentUser, isSharingLive]); // Runs whenever 'vitals' updates (1s)

    // 3. TIMER ENGINE (UI Only)
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // --- ECG WAVEFORM ANIMATION LOOP ---
    useEffect(() => {
        let tick = 0;
        const ecgTimer = setInterval(() => {
            setEcgData(prev => {
                // Simulate P-QRS-T Wave
                let val = 50;
                const step = tick % 40; // Cycle length

                // P Wave
                if (step >= 5 && step < 10) val += 5;
                // QRS Complex
                else if (step === 12) val -= 10; // Q
                else if (step === 13) val += 80; // R
                else if (step === 14) val -= 20; // S
                // T Wave
                else if (step >= 20 && step < 28) val += 8;

                // Add noise
                val += Math.random() * 4 - 2;

                const newPoint = { time: tick, value: val };
                const newData = [...prev.slice(1), newPoint];
                return newData;
            });
            tick++;
        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(ecgTimer);
    }, []);

    return (
        <div className="flex flex-col gap-6">
            {/* Header & Compact Connection Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">My Vitals</h2>
                    <p className="text-sm text-gray-500">Real-time health monitoring</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Manual Save Snapshot */}
                    <button
                        onClick={handleSaveSnapshot}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-200"
                        title="Save current vitals to history"
                    >
                        <Save size={16} />
                        <span className="hidden sm:inline">Save Snapshot</span>
                    </button>

                    {/* Recording Control */}
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${isRecording ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                        {isRecording && (
                            <div className="flex items-center gap-2 text-red-600 font-mono font-medium text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                {formatTime(elapsedTime)}
                            </div>
                        )}
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center gap-2 text-sm font-bold px-2 py-0.5 rounded-full transition-colors ${
                                isRecording 
                                ? 'text-red-600 hover:text-red-700' 
                                : 'text-slate-700 hover:text-slate-900'
                            }`}
                        >
                            {isRecording ? (
                                <><Square size={14} fill="currentColor" /> Stop {isSharingLive ? 'Upload' : 'Rec'}</>
                            ) : (
                                <><Play size={14} fill="currentColor" /> {isSharingLive ? 'Go Live' : 'Record'}</>
                            )}
                        </button>
                    </div>

                {currentUser?.assignedDoctorId ? (
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 self-start sm:self-auto">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 right-0 animate-pulse"></div>
                            <Share2 size={16} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Doctor Connected</span>
                            <span className="text-[10px] text-blue-600 leading-none opacity-80">
                                Sharing: {currentUser.sharingPermissions?.live ? 'Live' : ''}
                                {currentUser.sharingPermissions?.live && currentUser.sharingPermissions?.history ? ' & ' : ''}
                                {currentUser.sharingPermissions?.history ? 'History' : ''}
                            </span>
                        </div>
                        <button
                            onClick={() => setActiveNav('share')}
                            className="ml-1 p-1 hover:bg-blue-100 rounded-full transition-colors text-blue-500"
                        >
                            <Settings size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setActiveNav('share')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors self-start sm:self-auto"
                    >
                        <Share2 size={16} />
                        <span>Connect Doctor</span>
                    </button>
                )}
                </div>
            </div>

            {/* Modern Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Heart Rate */}
                <VitalCard
                    title="Heart Rate"
                    value={vitals.heartRate}
                    unit="bpm"
                    icon={<Heart className="text-rose-500" size={24} />}
                    status={vitals.heartRate > 100 ? 'High' : vitals.heartRate < 60 ? 'Low' : 'Normal'}
                    color="rose"
                    chartData={history}
                    dataKey="hr"
                />

                {/* SpO2 */}
                <VitalCard
                    title="SpO2"
                    value={vitals.spo2}
                    unit="%"
                    icon={<Droplets className="text-sky-500" size={24} />}
                    status={vitals.spo2 < 95 ? 'Low' : 'Normal'}
                    color="sky"
                    chartData={history}
                    dataKey="spo2"
                />

                {/* Body Temp */}
                <VitalCard
                    title="Body Temp"
                    value={vitals.bodyTemp}
                    unit="°C"
                    icon={<Thermometer className="text-amber-500" size={24} />}
                    status={vitals.bodyTemp > 37.5 ? 'Fever' : 'Normal'}
                    color="amber"
                    chartData={history}
                    dataKey="bodyTemp"
                />

                {/* Room Temp */}
                <VitalCard
                    title="Room Temp"
                    value={vitals.roomTemp}
                    unit="°C"
                    icon={<Wind className="text-teal-500" size={24} />}
                    status="Ambient"
                    color="teal"
                    chartData={history}
                    dataKey="roomTemp"
                />

                {/* ECG */}
                <VitalCard
                    title="ECG"
                    value={vitals.ecg}
                    unit=""
                    icon={<Activity className="text-purple-500" size={24} />}
                    status="Rhythm"
                    color="purple"
                    chartData={ecgData}
                    dataKey="value"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart (HR & SpO2) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800">Live Trends</h3>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Heart Rate
                            </span>
                            <span className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-sky-500"></span> SpO2
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={history}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                                <YAxis domain={[40, 160]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area type="linear" dataKey="hr" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorHr)" isAnimationActive={false} />
                                <Line type="linear" dataKey="spo2" stroke="#0ea5e9" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ECG Visualizer (Simulated) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800">ECG Monitor</h3>
                        <Zap size={16} className="text-emerald-500" />
                    </div>

                    <div className="flex-1 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center min-h-[200px]">
                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Simulated ECG Line */}
                        <div className="absolute inset-0 flex items-center px-4">
                            <div className="w-full h-[120px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={ecgData}>
                                        <Line
                                            type="linear"
                                            dataKey="value"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-500 font-mono">LIVE</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">PR Interval</p>
                            <p className="font-semibold text-gray-800">0.16s</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">QRS Duration</p>
                            <p className="font-semibold text-gray-800">0.09s</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VitalCard = ({ title, value, unit, icon, status, color, chartData, dataKey }) => {
    const colorClasses = {
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        sky: 'bg-sky-50 text-sky-600 border-sky-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        teal: 'bg-teal-50 text-teal-600 border-teal-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
    };

    const baseClass = colorClasses[color] || colorClasses.sky;
    const strokeColor = color === 'rose' ? '#e11d48' : color === 'sky' ? '#0284c7' : color === 'amber' ? '#d97706' : color === 'teal' ? '#0d9488' : '#9333ea';

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${baseClass} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${['Normal', 'Ambient', 'Rhythm'].includes(status) ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                    {status}
                </span>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <span className="text-sm text-gray-400 font-medium">{unit}</span>
                </div>
            </div>

            {/* Sparkline Chart */}
            {chartData && (
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} /><stop offset="100%" stopColor={strokeColor} stopOpacity={0} /></linearGradient>
                            </defs>
                            <Area type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} fill={`url(#grad-${color})`} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default MyVitalsView;
