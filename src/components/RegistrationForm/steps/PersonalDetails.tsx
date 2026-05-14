import React, { useState, useEffect } from 'react';

interface PersonalDetailsProps {
  data: any;
  onNext: (data: any) => void;
}

export default function PersonalDetails({ data, onNext }: PersonalDetailsProps) {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    dob: data.dob || '',
    age: data.age || '',
    gender: data.gender || '',
    bloodGroup: data.bloodGroup || '',
    mobile: data.mobile || '',
    email: data.email || ''
  });
  const [errors, setErrors] = useState<any>({});

  // Auto-calculate age
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  const validate = () => {
    let newErrors: any = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be exactly 10 digits';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid Email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <div className="form-group">
        <label>Full Name (as per official documents)</label>
        <input 
          type="text" 
          name="fullName"
          value={formData.fullName} 
          onChange={handleChange} 
          className="form-control" 
          placeholder="Enter your full name"
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth</label>
          <input 
            type="date" 
            name="dob"
            value={formData.dob} 
            onChange={handleChange} 
            className="form-control" 
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dob && <span className="error-message">{errors.dob}</span>}
        </div>
        <div className="form-group">
          <label>Age</label>
          <input 
            type="text" 
            value={formData.age} 
            className="form-control" 
            readOnly 
            placeholder="Auto-calculated"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-control">
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Mobile Number</label>
          <input 
            type="tel" 
            name="mobile"
            value={formData.mobile} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="10 digit mobile number"
            maxLength={10}
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="your.email@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>

      <div className="step-actions" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
