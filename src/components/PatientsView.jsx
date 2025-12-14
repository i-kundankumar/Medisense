import React from 'react';
import { Search, MoreVertical, FileText } from 'lucide-react';

const PatientsView = () => {
  const patients = [
    { id: 1, name: "Rahul Kumar", age: 45, gender: "Male", condition: "Hypertension", status: "Admitted", lastVisit: "Oct 24, 2025" },
    { id: 2, name: "Sneha Gupta", age: 28, gender: "Female", condition: "Pregnancy", status: "Outpatient", lastVisit: "Oct 22, 2025" },
    { id: 3, name: "Amit Verma", age: 62, gender: "Male", condition: "Diabetes T2", status: "Critical", lastVisit: "Oct 25, 2025" },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>My Patients</h2>
        <div className="search-bar">
          <Search size={18} color="#888" />
          <input type="text" placeholder="Search patients..." />
        </div>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age/Gender</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td className="fw-bold">{p.name}</td>
                <td>{p.age} / {p.gender}</td>
                <td>{p.condition}</td>
                <td>
                  <span className={`status-badge ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.lastVisit}</td>
                <td>
                  <button className="icon-btn"><FileText size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsView;