import React, { useState, useRef } from 'react';
import { X, Send, FileText, Loader2, Plus, Trash2, Eye, Edit3, Printer, Pill } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import logo from "../assets/logo.png";

const PrescribeModal = ({ patient, currentUser, onClose }) => {
    const [activeTab, setActiveTab] = useState('write');
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState([
        { name: "", dosage: "", frequency: "", duration: "" }
    ]);
    const [notes, setNotes] = useState("");
    const [isSending, setIsSending] = useState(false);

    const addMedication = () => {
        setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
    };

    const removeMedication = (index) => {
        if (medications.length > 1) {
            const newMeds = [...medications];
            newMeds.splice(index, 1);
            setMedications(newMeds);
        }
    };

    const updateMedication = (index, field, value) => {
        const newMeds = [...medications];
        newMeds[index][field] = value;
        setMedications(newMeds);
    };

    const handleSend = async () => {
        if (!diagnosis.trim() && medications.every(m => !m.name.trim())) {
            alert("Please enter a diagnosis or at least one medication.");
            return;
        }

        setIsSending(true);
        try {
            // Save Record to Firestore
            await addDoc(collection(db, "users", patient.id, "prescriptions"), {
                doctorId: currentUser.uid,
                doctorName: currentUser.fullName,
                doctorRegId: currentUser.registrationId || 'N/A',
                diagnosis,
                medications: medications.filter(m => m.name.trim()),
                notes,
                createdAt: serverTimestamp()
            });

            // Send Message
            const chatId = [currentUser.uid, patient.id].sort().join("_");
            await addDoc(collection(db, "messages"), {
                chatId,
                senderId: currentUser.uid,
                receiverId: patient.id,
                text: "📋 Prescription Sent", // Fallback text for older clients
                type: 'prescription',         // Special type for rendering
                content: {                    // Embedded data for instant view
                    diagnosis,
                    medications: medications.filter(m => m.name.trim()),
                    notes,
                    doctorName: currentUser.fullName,
                    doctorRegId: currentUser.registrationId || 'N/A',
                    date: new Date().toISOString()
                },
                createdAt: serverTimestamp()
            });

            alert(`Prescription sent to ${patient.fullName}!`);
            onClose();
        } catch (error) {
            console.error("Error sending prescription:", error);
            alert("Failed to send prescription. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    if (!patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Prescribe Medication</h3>
                            <p className="text-xs text-gray-500">For {patient.fullName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    <button
                        onClick={() => setActiveTab('write')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'write' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Edit3 size={16} /> Write Prescription
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Eye size={16} /> Preview
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {activeTab === 'write' ? (
                        <div className="space-y-6">
                            {/* Diagnosis */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Diagnosis</label>
                                <input
                                    type="text"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="e.g. Viral Fever, Hypertension..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Medications */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Medications</label>
                                    <button onClick={addMedication} className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
                                        <Plus size={14} /> Add Drug
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {medications.map((med, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-100 group">
                                            <div className="flex-1 w-full sm:w-auto">
                                                <input
                                                    type="text"
                                                    value={med.name}
                                                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                    placeholder="Drug Name"
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="w-full sm:w-24">
                                                <input
                                                    type="text"
                                                    value={med.dosage}
                                                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                    placeholder="Dosage"
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="w-full sm:w-32">
                                                <input
                                                    type="text"
                                                    value={med.frequency}
                                                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                                    placeholder="Frequency"
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="w-full sm:w-24">
                                                <input
                                                    type="text"
                                                    value={med.duration}
                                                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                                    placeholder="Duration"
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeMedication(index)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={medications.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Instructions, advice, or follow-up details..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                                ></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col relative">
                            {/* Prescription Header */}
                            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={logo} alt="Medisense" className="h-12 w-auto object-contain" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-blue-900">Medisense</h2>
                                        <p className="text-xs text-gray-500">Smart Healthcare Monitoring</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-lg font-bold text-gray-900">Dr. {currentUser.fullName}</h3>
                                    <p className="text-sm text-gray-600">Reg. No: {currentUser.registrationId || 'N/A'}</p>
                                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex justify-between mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Patient Name</p>
                                    <p className="font-semibold text-gray-900">{patient.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Age / Gender</p>
                                    <p className="font-semibold text-gray-900">{patient.age} / {patient.gender}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Patient ID</p>
                                    <p className="font-mono text-sm text-gray-900">{patient.id.slice(0, 8)}...</p>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-900 uppercase mb-1">Diagnosis</h4>
                                <p className="text-gray-700">{diagnosis || 'Not specified'}</p>
                            </div>

                            {/* Rx */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-4xl font-serif font-bold text-gray-800">Rx</span>
                                </div>
                                <div className="space-y-4 pl-4">
                                    {medications.map((med, i) => (
                                        med.name && (
                                            <div key={i} className="border-b border-gray-100 pb-2 last:border-0">
                                                <p className="font-bold text-gray-900 text-lg">{med.name} <span className="text-sm font-normal text-gray-500 ml-2">{med.dosage}</span></p>
                                                <p className="text-sm text-gray-600">{med.frequency} • {med.duration}</p>
                                            </div>
                                        )
                                    ))}
                                    {medications.every(m => !m.name) && <p className="text-gray-400 italic">No medications added.</p>}
                                </div>
                            </div>

                            {/* Notes */}
                            {notes && (
                                <div className="mt-8 pt-6 border-t border-dashed border-gray-200 relative z-10 px-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Advice / Notes</h4>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{notes}</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-16 pt-8 flex justify-between items-end relative z-10">
                                <div className="text-xs text-slate-400">
                                    <p>Medisense Healthcare</p>
                                    <p>Digital Prescription</p>
                                </div>
                                <div className="text-center">
                                    <div className="h-16 w-40 mb-2 flex items-end justify-center">
                                        <span className="font-serif italic text-2xl text-blue-900 opacity-80">Dr. {currentUser.fullName.split(' ')[0]}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 border-t border-slate-300 pt-2 px-8 uppercase tracking-wide">Doctor's Signature</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
                    <button onClick={onClose} disabled={isSending} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSending ? 'Sending...' : 'Send & Notify'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrescribeModal;
