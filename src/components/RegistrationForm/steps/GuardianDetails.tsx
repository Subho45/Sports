import React, { useState } from 'react';

interface GuardianDetailsProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function GuardianDetails({ data, onNext, onBack }: GuardianDetailsProps) {
  const [formData, setFormData] = useState({
    fatherName: data.fatherName || '',
    motherName: data.motherName || '',
    guardianName: data.guardianName || '',
    guardianMobile: data.guardianMobile || '',
    guardianEmail: data.guardianEmail || ''
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};
    if (!formData.fatherName.trim() && !formData.motherName.trim() && !formData.guardianName.trim()) {
      newErrors.fatherName = 'At least one parent/guardian name is required';
    }
    if (!/^\d{10}$/.test(formData.guardianMobile)) {
      newErrors.guardianMobile = 'Mobile must be exactly 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <div className="form-group">
        <label>Father's Name</label>
        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="form-control" />
        {errors.fatherName && <span className="error-message">{errors.fatherName}</span>}
      </div>
      <div className="form-group">
        <label>Mother's Name</label>
        <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Guardian's Name (If applicable)</label>
        <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="form-control" />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Parent/Guardian Mobile Number</label>
          <input type="tel" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} className="form-control" maxLength={10} />
          {errors.guardianMobile && <span className="error-message">{errors.guardianMobile}</span>}
        </div>
        <div className="form-group">
          <label>Parent/Guardian Email (Optional)</label>
          <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
