"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('athletes');
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      const res = await fetch('/api/admin/athletes');
      const data = await res.json();
      if (data.success) {
        setAthletes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch athletes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.location.href = '/api/admin/export';
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const closeModal = () => setSelectedAthlete(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/athletes/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setAthletes(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setSelectedAthlete((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        alert("Failed to update status: " + data.error);
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };


  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-sidebar glass-card">
        <h2 style={{ padding: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>Admin Portal</h2>
        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
          <button className={`nav-item ${activeTab === 'athletes' ? 'active' : ''}`} onClick={() => setActiveTab('athletes')}>
            Registered Athletes
          </button>
          
          <div style={{ marginTop: 'auto', padding: '1rem' }}>
            <button onClick={handleLogout} className="btn btn-destructive w-full">
              Logout
            </button>
          </div>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'athletes' && (
          <div className="tab-pane animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Athlete Database</h2>
              <button onClick={handleExport} className="btn btn-success">
                ⬇ Export to Excel
              </button>
            </div>
            
            {loading ? (
              <p>Loading athletes data...</p>
            ) : (
              <div className="table-container glass-card" style={{ padding: 0, overflow: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Age Group</th>
                      <th>Competition</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athletes.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No athletes found in database.</td>
                      </tr>
                    )}
                    {athletes.map(athlete => (
                      <tr key={athlete.id}>
                        <td><strong>{athlete.fullName}</strong></td>
                        <td>{athlete.mobileNumber}</td>
                        <td>{athlete.ageGroupApplied}</td>
                        <td>{athlete.categoryLevel}</td>
                        <td>
                          <span className={`status-badge ${athlete.status.toLowerCase().replace('_', '-')}`}>{athlete.status}</span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => setSelectedAthlete(athlete)}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedAthlete && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Athlete Profile: {selectedAthlete.fullName}</h2>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxHeight: '70vh', overflowY: 'auto', padding: '1rem' }}>
              
              <div>
                <h3>Personal Details</h3>
                <p><strong>DOB:</strong> {selectedAthlete.dob} ({selectedAthlete.age} years)</p>
                <p><strong>Gender:</strong> {selectedAthlete.gender}</p>
                <p><strong>Blood Group:</strong> {selectedAthlete.bloodGroup}</p>
                <p><strong>Email:</strong> {selectedAthlete.email}</p>
                <p><strong>Mobile:</strong> {selectedAthlete.mobileNumber}</p>
                
                <h3 style={{ marginTop: '1.5rem' }}>Address</h3>
                <p>{selectedAthlete.address}</p>
                <p>{selectedAthlete.city}, {selectedAthlete.state} - {selectedAthlete.pinCode}</p>
              </div>

              <div>
                <h3>Guardian Details</h3>
                <p><strong>Father:</strong> {selectedAthlete.fatherName}</p>
                <p><strong>Mother:</strong> {selectedAthlete.motherName}</p>
                <p><strong>Mobile:</strong> {selectedAthlete.guardianMobile}</p>

                <h3 style={{ marginTop: '1.5rem' }}>Competition Info</h3>
                <p><strong>Club:</strong> {selectedAthlete.clubName}</p>
                <p><strong>State Rep:</strong> {selectedAthlete.stateRep}</p>
                <p><strong>Category:</strong> {selectedAthlete.categoryLevel}</p>
                <p><strong>Events:</strong> {selectedAthlete.events}</p>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <h3>Uploaded Documents</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <a href={selectedAthlete.passportPhotoUrl} target="_blank" className="btn btn-outline">🖼️ Passport Photo</a>
                  <a href={selectedAthlete.aadhaarUrl} target="_blank" className="btn btn-outline">📄 Aadhaar</a>
                  <a href={selectedAthlete.dobProofUrl} target="_blank" className="btn btn-outline">📄 DOB Proof</a>
                  <a href={selectedAthlete.bonafideUrl} target="_blank" className="btn btn-outline">🏫 Bonafide</a>
                  <a href={selectedAthlete.insuranceDocUrl} target="_blank" className="btn btn-outline">🛡️ Insurance</a>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Update Registration Status</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <select 
                    className="form-control" 
                    style={{ maxWidth: '250px' }}
                    value={selectedAthlete.status}
                    onChange={(e) => handleStatusUpdate(selectedAthlete.id, e.target.value)}
                  >
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="COMPLETED">Payment Completed</option>
                    <option value="VERIFIED">Documents Verified</option>
                    <option value="REJECTED">Registration Rejected</option>
                  </select>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                    Current Status: <span className={`status-badge ${selectedAthlete.status.toLowerCase().replace('_', '-')}`}>{selectedAthlete.status}</span>
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 90%;
          max-width: 900px;
          background: var(--card);
          border-radius: 12px;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

      `}</style>
    </div>
  );
}
