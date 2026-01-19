import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Plus, X, User } from 'lucide-react';
import { db } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";

const AppointmentsView = ({ currentUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [myPatients, setMyPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDoctor = currentUser?.role === 'doctor';

  // New Appointment Form State
  const [formData, setFormData] = useState({
    patientId: '', // Added to track ID specifically
    patientName: '',
    date: '',
    time: '',
    type: 'General Checkup',
    location: 'Room 304'
  });

  // --- 1. Fetch Appointments from Firestore ---
  useEffect(() => {
    if (!currentUser?.uid) return;

    let q;
    if (isDoctor) {
      // Doctor sees appointments where they are the doctor
      q = query(collection(db, "appointments"), where("doctorId", "==", currentUser.uid));
    } else {
      // Patient sees appointments where they are the patient
      q = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Optional: Sort by date/time client-side if needed
      setAppointments(apts);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- 1.5 Fetch My Patients ---
  useEffect(() => {
    if (!currentUser?.uid || !isDoctor) return;

    const q = query(
      collection(db, "users"),
      where("role", "==", "patient"),
      where("assignedDoctorId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyPatients(patients);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- 2. Handle Status Update (Accept/Decline) ---
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // --- 3. Handle Create Appointment ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      let appointmentData = {
        time: `${formData.date} ${formData.time}`,
        rawDate: formData.date,
        rawTime: formData.time,
        type: formData.type,
        location: formData.location,
        createdAt: serverTimestamp()
      };

      if (isDoctor) {
        // DOCTOR CREATING: Auto-Confirm
        // Find patient details from the selected ID
        const selectedPatient = myPatients.find(p => p.id === formData.patientId);

        appointmentData = {
          ...appointmentData,
          doctorId: currentUser.uid,
          doctorName: currentUser.fullName || "Doctor",
          patientId: formData.patientId,
          patientName: selectedPatient ? selectedPatient.fullName : formData.patientName,
          status: 'Confirmed' // Doctor schedules are confirmed by default
        };
      } else {
        // PATIENT REQUESTING: Pending
        if (!currentUser.assignedDoctorId) {
          alert("You must be connected to a doctor to request an appointment.");
          setIsSubmitting(false);
          return;
        }

        // Fetch assigned doctor's name (optional, but good for display)
        const docRef = doc(db, "users", currentUser.assignedDoctorId);
        const docSnap = await getDoc(docRef);
        const doctorName = docSnap.exists() ? docSnap.data().fullName : "Doctor";

        appointmentData = {
          ...appointmentData,
          doctorId: currentUser.assignedDoctorId,
          doctorName: doctorName,
          patientId: currentUser.uid,
          patientName: currentUser.fullName,
          status: 'Pending' // Requests need approval
        };
      }

      await addDoc(collection(db, "appointments"), {
        ...appointmentData
      });
      setShowModal(false);
      setFormData({ patientId: '', patientName: '', date: '', time: '', type: 'General Checkup', location: 'Room 304' });
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Appointments</h2>
          <p className="text-sm text-slate-500">Manage your schedule and patient visits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          {isDoctor ? 'New Appointment' : 'Request Appointment'}
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {appointments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
            <Calendar size={48} className="mx-auto mb-3 opacity-20" />
            <p>No appointments scheduled.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold border border-indigo-100">
                    {isDoctor ? (apt.patientName ? apt.patientName.charAt(0).toUpperCase() : <User size={20} />) : <Calendar size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{isDoctor ? apt.patientName : `Dr. ${apt.doctorName?.split(' ')[0]}`}</h3>
                    <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  apt.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-slate-100 text-slate-500'
                  }`}>
                  {apt.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{apt.rawDate || apt.time?.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  <span>{apt.rawTime || apt.time?.split(' ').slice(1).join(' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{apt.location || 'Clinic'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-50">
                {apt.status === 'Pending' && isDoctor ? (
                  <>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={16} /> Decline
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => isDoctor && handleStatusChange(apt.id, 'Completed')}
                    disabled={!isDoctor || apt.status === 'Completed' || apt.status === 'Cancelled'}
                    className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {apt.status === 'Completed' ? 'Visit Completed' : (isDoctor ? 'Mark as Completed' : (apt.status === 'Pending' ? 'Waiting for Approval' : apt.status))}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">{isDoctor ? 'Schedule Appointment' : 'Request Appointment'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {isDoctor ? (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Patient Name</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.patientId}
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  >
                    <option value="">Select a patient</option>
                    {myPatients.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                  Requesting appointment with your assigned doctor.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option>General Checkup</option>
                  <option>Follow-up</option>
                  <option>Lab Results</option>
                  <option>Consultation</option>
                  <option>Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-2 disabled:opacity-70"
              >
                {isSubmitting ? 'Processing...' : (isDoctor ? 'Confirm Appointment' : 'Send Request')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;
