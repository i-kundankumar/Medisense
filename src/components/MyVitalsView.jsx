import React, { useState, useEffect, useRef } from 'react';
import { Heart, Thermometer, Droplets, Share2, Activity, Wind, Zap, Settings, AlertCircle, Play, Square, Save, Link, X } from 'lucide-react';
import { Area, AreaChart, ComposedChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";

const MyVitalsView = ({ currentUser, setActiveNav }) => {
    // --- STATE FOR PATIENT VITALS (Simulation) ---
    const [vitals, setVitals] = useState({
        heartRate: 0,
        spo2: 0,
        bodyTemp: 0,
        roomTemp: 0,
        ecg: '--'
    });

    // --- DEVICE CONNECTION STATE ---
    const [isDeviceLinked, setIsDeviceLinked] = useState(false);
    const [connectedMacAddress, setConnectedMacAddress] = useState("");
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [macInput, setMacInput] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectError, setConnectError] = useState("");

    // Sync connection state with user profile
    useEffect(() => {
        if (currentUser?.connectedDeviceId) {
            setIsDeviceLinked(true);
            setConnectedMacAddress(currentUser.connectedDeviceId);
        } else {
            setIsDeviceLinked(false);
            setConnectedMacAddress("");
        }
    }, [currentUser?.connectedDeviceId]);

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

    // Ref to track last live update time
    const lastLiveUpdate = useRef(0);

    // Initialize with dummy data so the chart isn't empty on load
    const [history, setHistory] = useState([]);

    // --- ECG DUMMY DATA STATE ---
    const [ecgData, setEcgData] = useState([]);

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

    // --- CONNECT DEVICE HANDLERS ---
    const handleConnectClick = () => {
        setConnectError("");
        setMacInput(connectedMacAddress || "");
        setShowConnectModal(true);
    };

    const confirmConnection = async () => {
        if (!macInput.trim()) {
            setConnectError("Please enter a MAC address");
            return;
        }

        setIsConnecting(true);
        setConnectError("");

        try {
            const mac = macInput.trim();
            const registryRef = doc(db, "registry", mac);
            const docSnap = await getDoc(registryRef);

            if (docSnap.exists()) {
                const deviceData = docSnap.data();

                // Check if device is already assigned to another user
                if (deviceData.ownerId && deviceData.ownerId !== currentUser.uid) {
                    setConnectError("Device is already assigned to another user.");
                    return;
                }

                // 1. Handshake: Write User ID to Registry (if not already assigned)
                if (deviceData.ownerId !== currentUser.uid) {
                    await updateDoc(registryRef, {
                        ownerId: currentUser.uid,
                        status: 'assigned',
                        assignedAt: serverTimestamp()
                    });
                }

                // 2. Save Device to User Profile (Persistence)
                await updateDoc(doc(db, "users", currentUser.uid), {
                    connectedDeviceId: mac
                });

                setIsDeviceLinked(true);
                setConnectedMacAddress(mac);
                setShowConnectModal(false);
            } else {
                setConnectError("Device not found in registry.");
            }
        } catch (error) {
            console.error("Connection failed:", error);
            setConnectError("Failed to connect. Check console.");
        } finally {
            setIsConnecting(false);
        }
    };

    // --- DISCONNECT DEVICE HANDLER ---
    const handleDisconnect = async () => {
        if (!connectedMacAddress) return;

        setIsConnecting(true);
        try {
            // 1. Remove User from Registry
            const registryRef = doc(db, "registry", connectedMacAddress);
            // We attempt to update the registry. Even if the device is offline, this DB write should succeed.
            await updateDoc(registryRef, {
                ownerId: null,
                status: 'ready',
                assignedAt: null
            });

            // 2. Remove Device from User Profile
            await updateDoc(doc(db, "users", currentUser.uid), {
                connectedDeviceId: null
            });

            // 3. Reset Local State
            setIsDeviceLinked(false);
            setConnectedMacAddress("");
            setShowConnectModal(false);
            setVitals({
                heartRate: 0,
                spo2: 0,
                bodyTemp: 0,
                roomTemp: 0,
                ecg: '--'
            });
            alert("Device disconnected successfully.");
        } catch (error) {
            console.error("Disconnect failed:", error);
            setConnectError("Failed to disconnect. Check console.");
        } finally {
            setIsConnecting(false);
        }
    };

    // 1. DATA SOURCE ENGINE (Simulation vs Device Stream)
    useEffect(() => {
        let unsubscribe;

        if (isDeviceLinked && currentUser?.uid) {
            // --- DEVICE MODE: Listen to Firestore ---
            const userRef = doc(db, "users", currentUser.uid);
            unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data?.currentVitals) {
                        const remoteVitals = data.currentVitals;

                        // Update Vitals State
                        setVitals(prev => ({
                            ...prev,
                            ...remoteVitals,
                            // Ensure ECG is kept if not provided by device, or update if it is
                            ecg: remoteVitals.ecg || prev.ecg
                        }));

                        // Update History for Chart
                        const timestamp = remoteVitals.lastUpdated?.toDate
                            ? remoteVitals.lastUpdated.toDate()
                            : new Date();

                        const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                        setHistory(prev => {
                            const newHistory = [...prev, {
                                time: timeStr,
                                hr: remoteVitals.heartRate || 0,
                                spo2: remoteVitals.spo2 || 0,
                                bodyTemp: remoteVitals.bodyTemp || 0,
                                roomTemp: remoteVitals.roomTemp || 0
                            }];
                            return newHistory.slice(-20);
                        });
                    }
                }
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isDeviceLinked, currentUser?.uid]);

    // 2. UPLOAD ENGINE (Handles Firestore Writes)
    useEffect(() => {
        if (!isRecording || !currentUser?.uid) return;

        const handleUpload = async () => {
            const now = Date.now();

            // A. RECORDING: Save to History Collection
            try {
                await addDoc(collection(db, "users", currentUser.uid, "vitalsHistory"), {
                    ...vitals,
                    timestamp: serverTimestamp(),
                    readableTime: new Date().toLocaleString(),
                    type: 'auto_log'
                });
            } catch (error) {
                console.error("Error recording history:", error);
            }

            // B. LIVE SHARING: Update Current Vitals Node (Only if NO device is linked)
            // If device is linked, IT updates the live node directly. We shouldn't overwrite it.
            if (!isDeviceLinked && isSharingLive && now - lastLiveUpdate.current >= 2000) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userRef, {
                        currentVitals: {
                            ...vitals,
                            lastUpdated: serverTimestamp()
                        }
                    });
                    lastLiveUpdate.current = now;
                } catch (e) {
                    console.error("Error updating live vitals:", e);
                }
            }
        };

        handleUpload();
    }, [vitals, isRecording, currentUser?.uid, isSharingLive, isDeviceLinked]); // Runs whenever 'vitals' updates (1s)

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

                    {/* Connect Device Button */}
                    <button
                        onClick={handleConnectClick}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2 rounded-full border ${isDeviceLinked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-slate-600 border-gray-200 hover:border-blue-200 hover:text-blue-600'}`}
                    >
                        <Link size={16} />
                        <span className="hidden sm:inline">{isDeviceLinked ? 'Device Linked' : 'Connect Device'}</span>
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
                            className={`flex items-center gap-2 text-sm font-bold px-2 py-0.5 rounded-full transition-colors ${isRecording
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

            {/* Device Connection Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">{isDeviceLinked ? 'Device Settings' : 'Connect Device'}</h3>
                            <button onClick={() => setShowConnectModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {isDeviceLinked ? (
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <Link size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-green-800 uppercase tracking-wider">Connected Device</p>
                                            <p className="text-lg font-mono font-bold text-green-900">{connectedMacAddress}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        Your device is currently linked and streaming vitals. Disconnecting will stop data synchronization.
                                    </p>

                                    <button
                                        onClick={handleDisconnect}
                                        disabled={isConnecting}
                                        className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {isConnecting ? 'Disconnecting...' : 'Disconnect Device'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Enter the unique MAC address found on your device label (e.g., B4E62D).
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">MAC Address</label>
                                            <input
                                                type="text"
                                                value={macInput}
                                                onChange={(e) => setMacInput(e.target.value.toUpperCase())}
                                                placeholder="B4E62D..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            />
                                        </div>

                                        {connectError && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                                                <AlertCircle size={16} />
                                                {connectError}
                                            </div>
                                        )}

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setShowConnectModal(false)}
                                                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={confirmConnection}
                                                disabled={isConnecting}
                                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                            >
                                                {isConnecting ? 'Connecting...' : <><Link size={18} /> Connect</>}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
