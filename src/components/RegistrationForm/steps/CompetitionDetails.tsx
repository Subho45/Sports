import React, { useState } from 'react';

interface CompetitionDetailsProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function CompetitionDetails({ data, onNext, onBack }: CompetitionDetailsProps) {
  const [formData, setFormData] = useState({
    ageGroup: data.ageGroup || '',
    category: data.category || '',
    events: data.events || []
  });
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};
    if (!formData.ageGroup) newErrors.ageGroup = 'Age Group is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.events.length === 0) newErrors.events = 'Select at least one event';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleEventToggle = (event: string) => {
    setFormData(prev => {
      const isSelected = prev.events.includes(event);
      const newEvents = isSelected 
        ? prev.events.filter((e: string) => e !== event)
        : [...prev.events, event];
      
      if (errors.events && newEvents.length > 0) {
        setErrors({ ...errors, events: null });
      }
      return { ...prev, events: newEvents };
    });
  };

  const availableEvents = ['100m Sprint', 'Long Jump', 'High Jump', 'Shot Put', 'Relay 4x100m'];

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <div className="form-row">
        <div className="form-group">
          <label>Age Group Applied For</label>
          <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="form-control">
            <option value="">Select Age Group</option>
            <option value="U-14">Under 14</option>
            <option value="U-16">Under 16</option>
            <option value="U-18">Under 18</option>
            <option value="Senior">Senior (18+)</option>
          </select>
          {errors.ageGroup && <span className="error-message">{errors.ageGroup}</span>}
        </div>
        <div className="form-group">
          <label>Category / Level</label>
          <select name="category" value={formData.category} onChange={handleChange} className="form-control">
            <option value="">Select Category</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Event / Competition Selection (Multi-select permitted)</label>
        <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {availableEvents.map(ev => (
            <div 
              key={ev} 
              onClick={() => handleEventToggle(ev)}
              style={{
                padding: '1rem',
                border: `1px solid ${formData.events.includes(ev) ? 'var(--primary)' : 'var(--glass-border)'}`,
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                background: formData.events.includes(ev) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              {ev}
            </div>
          ))}
        </div>
        {errors.events && <span className="error-message">{errors.events}</span>}
      </div>

      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
