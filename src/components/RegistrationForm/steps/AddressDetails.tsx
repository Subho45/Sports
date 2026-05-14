import React, { useState } from 'react';

interface AddressDetailsProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function AddressDetails({ data, onNext, onBack }: AddressDetailsProps) {
  const [formData, setFormData] = useState({
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    pinCode: data.pinCode || '',
    country: data.country || 'India'
  });
  const [errors, setErrors] = useState<any>({});
  const [isDetecting, setIsDetecting] = useState(false);

  const mockStateDetection = (pin: string) => {
    if (pin.length === 6) {
      setIsDetecting(true);
      // Simulate API call
      setTimeout(() => {
        let detectedState = 'Unknown';
        if (pin.startsWith('1')) detectedState = 'Delhi / Haryana / Punjab';
        else if (pin.startsWith('4')) detectedState = 'Maharashtra / MP';
        else if (pin.startsWith('5')) detectedState = 'Karnataka / AP';
        else if (pin.startsWith('6')) detectedState = 'Tamil Nadu / Kerala';
        else if (pin.startsWith('7')) detectedState = 'West Bengal / Odisha';
        else if (pin.startsWith('8')) detectedState = 'Bihar / Jharkhand';
        else detectedState = 'Other State';
        
        setFormData(prev => ({ ...prev, state: detectedState }));
        setIsDetecting(false);
      }, 800);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, pinCode: val }));
    if (errors.pinCode) setErrors({ ...errors, pinCode: null });
    
    if (val.length === 6) {
      mockStateDetection(val);
    }
  };

  const validate = () => {
    let newErrors: any = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(formData.pinCode)) newErrors.pinCode = 'Valid 6-digit PIN Code required';
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
        <label>Current Address (with landmark)</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>PIN Code</label>
          <input type="text" name="pinCode" value={formData.pinCode} onChange={handlePinChange} className="form-control" maxLength={6} placeholder="e.g. 400001" />
          {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}
        </div>
        <div className="form-group">
          <label>State {isDetecting && <span style={{fontSize: '0.8rem', color: 'var(--primary)'}}>(Detecting...)</span>}</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" />
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City / District</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={formData.country} className="form-control" readOnly style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
