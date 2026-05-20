import React, { useState } from 'react';

interface ConsentProps {
  data: any;
  onNext: (data: boolean, payLater?: boolean) => void;
  onBack: () => void;
}

export default function Consent({ data, onNext, onBack }: ConsentProps) {
  const [agreed, setAgreed] = useState(data?.agreed || false);
  const [error, setError] = useState('');

  const handleChoice = (payLater: boolean) => {
    if (!agreed) {
      setError('You must agree to the terms and conditions to proceed.');
      return;
    }
    onNext(agreed, payLater);
  };

  return (
    <div className="form-step">
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--glass-border)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Declaration & Consent</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            I hereby declare that all the information provided by me in this application is true and correct to the best of my knowledge and belief. 
            I understand that any false information may lead to the cancellation of my registration.
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            I agree to abide by the rules and regulations of the sports club and the competition committee. 
            I also consent to the club using my details for the purpose of the competition and related administrative tasks.
          </p>
        </div>
        
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input 
            type="checkbox" 
            id="consent" 
            checked={agreed} 
            onChange={(e) => { setAgreed(e.target.checked); setError(''); }} 
            style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
          />
          <label htmlFor="consent" style={{ cursor: 'pointer', fontWeight: 500 }}>
            I confirm that all details provided are correct and I agree with the terms and conditions.
          </label>
        </div>
        {error && <p className="error-message" style={{ marginTop: '0.5rem' }}>{error}</p>}
      </div>

      <div className="step-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
          <button type="button" onClick={() => handleChoice(true)} className="btn btn-secondary">
            Submit & Pay Later
          </button>
          <button type="button" onClick={() => handleChoice(false)} className="btn btn-primary">
            Continue for Payment
          </button>
        </div>
      </div>
    </div>
  );
}
