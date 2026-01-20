import React, { useState } from 'react';
import { User, X, Activity, Heart, Droplets, Thermometer, Wind, ArrowLeft, History, FileText, Lock, Cloud } from 'lucide-react';
import HistoryView from './HistoryView';

const PatientMonitorModal = ({ patient, onClose }) => {
    const [activeTab, setActiveTab] = useState('live');
    if (!patient) return null;

    const isLiveShared = patient.sharingPermissions?.live;
    const isHistoryShared = patient.sharingPermissions?.history;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {patient.fullName ? patient.fullName.charAt(0).toUpperCase() : <User size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{patient.fullName}</h3>
                            <p className="text-sm text-gray-500">
                                {patient.age} yrs • {patient.gender} • {patient.condition || 'General'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 bg-white">
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'live' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('live')}
                    >
                        <Activity size={16} /> Live Monitor
                    </button>
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <History size={16} /> History
                    </button>
                    <button
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <FileText size={16} /> Patient Details
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    {activeTab === 'live' && (
                        <div className="p-8">
                            {!isLiveShared ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Lock size={32} className="opacity-20" />
                                    </div>
                                    <p className="font-medium">Access Restricted</p>
                                    <p className="text-sm opacity-70">Patient is not sharing live vitals.</p>
                                </div>
                            ) : patient.currentVitals ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                            <Activity className="text-emerald-500 animate-pulse" size={20} />
                                            Live Vitals Stream
                                        </h4>
                                        <span className="text-xs text-gray-400 font-mono">
                                            Last Update: {patient.currentVitals.lastUpdated?.toDate().toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2"><div className="p-2 bg-rose-50 rounded-lg text-rose-500"><Heart size={20} /></div></div>
                                            <p className="text-sm text-gray-500">Heart Rate</p>
                                            <h3 className="text-2xl font-bold text-gray-900">{patient.currentVitals.heartRate} <span className="text-sm text-gray-400 font-normal">bpm</span></h3>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2"><div className="p-2 bg-sky-50 rounded-lg text-sky-500"><Droplets size={20} /></div></div>
                                            <p className="text-sm text-gray-500">SpO2</p>
                                            <h3 className="text-2xl font-bold text-gray-900">{patient.currentVitals.spo2} <span className="text-sm text-gray-400 font-normal">%</span></h3>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2"><div className="p-2 bg-amber-50 rounded-lg text-amber-500"><Thermometer size={20} /></div></div>
                                            <p className="text-sm text-gray-500">Body Temp</p>
                                            <h3 className="text-2xl font-bold text-gray-900">{patient.currentVitals.bodyTemp} <span className="text-sm text-gray-400 font-normal">°C</span></h3>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2"><div className="p-2 bg-teal-50 rounded-lg text-teal-500"><Wind size={20} /></div></div>
                                            <p className="text-sm text-gray-500">Room Temp</p>
                                            <h3 className="text-2xl font-bold text-gray-900">{patient.currentVitals.roomTemp} <span className="text-sm text-gray-400 font-normal">°C</span></h3>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2"><div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Cloud size={20} /></div></div>
                                            <p className="text-sm text-gray-500">Humidity</p>
                                            <h3 className="text-2xl font-bold text-gray-900">{patient.currentVitals.humidity || 0} <span className="text-sm text-gray-400 font-normal">%</span></h3>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Activity size={32} className="opacity-20" />
                                    </div>
                                    <p className="font-medium">No live data available</p>
                                    <p className="text-sm opacity-70">This patient is not currently sharing live vitals.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="p-6">
                            {!isHistoryShared ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Lock size={32} className="opacity-20" />
                                    </div>
                                    <p className="font-medium">Access Restricted</p>
                                    <p className="text-sm opacity-70">Patient is not sharing history.</p>
                                </div>
                            ) : (
                                <HistoryView currentUser={{ ...patient, uid: patient.id }} />
                            )}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="p-8">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                                <h3 className="text-lg font-bold text-gray-800 mb-6">Patient Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                        <p className="text-gray-900 font-medium text-base">{patient.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Age</label>
                                        <p className="text-gray-900 font-medium text-base">{patient.age || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                                        <p className="text-gray-900 font-medium text-base">{patient.gender || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Condition</label>
                                        <p className="text-gray-900 font-medium text-base">{patient.condition || 'General Checkup'}</p>
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-gray-50">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Patient ID</label>
                                        <p className="text-gray-500 font-mono text-sm bg-gray-50 p-2 rounded border border-gray-100 inline-block">{patient.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientMonitorModal;
