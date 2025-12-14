import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AppointmentsView = () => {
  const appointments = [
    { id: 1, patient: "Priya Sharma", time: "10:00 AM", type: "General Checkup", status: "Upcoming" },
    { id: 2, patient: "Arjun Singh", time: "11:30 AM", type: "Follow-up", status: "Pending" },
    { id: 3, patient: "Zara Ali", time: "02:00 PM", type: "Lab Results", status: "Completed" },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Today's Schedule</h2>
        <button className="primary-btn">New Appointment</button>
      </div>

      <div className="appointments-grid">
        {appointments.map((apt) => (
          <div key={apt.id} className="appointment-card">
            <div className="apt-left">
              <div className="time-box">
                <span className="time-val">{apt.time.split(' ')[0]}</span>
                <span className="time-period">{apt.time.split(' ')[1]}</span>
              </div>
              <div className="apt-info">
                <h3>{apt.patient}</h3>
                <p className="apt-type">{apt.type}</p>
                <div className="apt-meta">
                  <Clock size={14} /> <span>30 min</span>
                  <MapPin size={14} style={{marginLeft: 8}} /> <span>Room 304</span>
                </div>
              </div>
            </div>
            <div className="apt-actions">
               {apt.status === 'Pending' ? (
                 <>
                   <button className="action-btn accept"><CheckCircle size={18} /></button>
                   <button className="action-btn decline"><XCircle size={18} /></button>
                 </>
               ) : (
                 <span className={`status-text ${apt.status.toLowerCase()}`}>{apt.status}</span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsView;