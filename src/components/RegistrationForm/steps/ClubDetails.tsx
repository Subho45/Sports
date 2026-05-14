import React, { useState } from 'react';

interface ClubDetailsProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function ClubDetails({ data, onNext, onBack }: ClubDetailsProps) {
  const [formData, setFormData] = useState({
    clubName: data.clubName || '',
    stateRep: data.stateRep || '',
    districtRep: data.districtRep || '',
    nocFile: data.nocFile || null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('documentType', 'noc');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const result = await response.json();
        if (result.success) {
          setFormData({ ...formData, nocFile: result.url });
        } else {
          alert('NOC Upload failed: ' + result.error);
        }
      } catch (err) {
        console.error("NOC Upload error", err);
        alert('An error occurred during NOC upload.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <div className="form-group">
        <label>Club Name</label>
        <input type="text" name="clubName" value={formData.clubName} onChange={handleChange} className="form-control" placeholder="Optional" />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>State Representation</label>
          <input type="text" name="stateRep" value={formData.stateRep} onChange={handleChange} className="form-control" placeholder="Optional" />
        </div>
        <div className="form-group">
          <label>District</label>
          <input type="text" name="districtRep" value={formData.districtRep} onChange={handleChange} className="form-control" placeholder="Optional" />
        </div>
      </div>

      <div className="form-group">
        <label>Upload NOC (No Objection Certificate)</label>
        <div className="file-upload-zone" style={{ border: '2px dashed var(--glass-border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.2)' }}>
          <input type="file" id="noc" className="hidden-input" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
          <label htmlFor="noc" className="btn btn-outline" style={{ cursor: 'pointer' }}>
            {formData.nocFile ? 'Change File' : 'Choose File'}
          </label>
          {formData.nocFile && <p style={{ marginTop: '1rem', color: 'var(--primary)' }}>{formData.nocFile}</p>}
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>PDF, JPG up to 2MB. Optional if independent.</p>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
