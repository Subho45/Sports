import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentProps {
  data: any;
  onBack: () => void;
}

export default function Payment({ data, onBack }: PaymentProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const fee = 1500;
  
  const isPayLater = data.consent?.payLater === true;

  const handleSubmit = async () => {
    setProcessing(true);
    setErrorMsg('');
    
    try {
      // Fetch session to get userId
      const sessionRes = await fetch('/api/auth/me');
      const sessionData = await sessionRes.json();
      const userId = sessionData.authenticated ? sessionData.user.id : null;

      // Flatten data for API
      const payload = {
        userId,
        fullName: data.personal?.fullName,
        dob: data.personal?.dob,
        age: data.personal?.age ? parseInt(data.personal.age, 10) : 0,
        gender: data.personal?.gender,
        bloodGroup: data.personal?.bloodGroup,
        mobileNumber: data.personal?.mobile,
        email: data.personal?.email,
        
        fatherName: data.guardian?.fatherName,
        motherName: data.guardian?.motherName,
        guardianName: data.guardian?.guardianName,
        guardianMobile: data.guardian?.guardianMobile,
        guardianEmail: data.guardian?.guardianEmail,
        
        address: data.address?.address,
        city: data.address?.city,
        state: data.address?.state,
        pinCode: data.address?.pinCode,
        country: data.address?.country,
        
        clubName: data.club?.clubName || 'N/A',
        stateRep: data.club?.stateRep || 'N/A',
        district: data.club?.districtRep || 'N/A',
        nocClubUrl: data.club?.nocFile || "",
        nocStateUrl: "",
        
        ageGroupApplied: data.competition?.ageGroup || 'Senior',
        categoryLevel: data.competition?.category || 'Intermediate',
        events: data.competition?.events || [],
        
        passportPhotoUrl: data.documents?.photo,
        aadhaarUrl: data.documents?.aadhaar,
        dobProofUrl: data.documents?.birthCert,
        bonafideUrl: data.documents?.bonafide,
        
        insuranceProvider: data.documents?.insuranceProvider,
        policyNumber: data.documents?.insurancePolicy,
        insuranceExpiry: data.documents?.insuranceExpiry,
        insuranceDocUrl: data.documents?.insuranceDoc,
        
        consentAgreed: true,
        paymentStatus: isPayLater ? "PENDING" : "PAID",
      };
      
      console.log("🚀 Submitting Registration Payload:", payload);

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseData = await res.json();
      
      if (!res.ok) {
        let message = responseData.error || 'Failed to submit registration';
        if (responseData.details) {
          // Extract the first error message from Zod details if available
          const firstErrorField = Object.keys(responseData.details).find(k => k !== '_errors');
          if (firstErrorField) {
            const fieldError = responseData.details[firstErrorField]._errors[0];
            message = `${firstErrorField}: ${fieldError}`;
          }
        }
        throw new Error(message);
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/athlete/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Registration failed');
      setStatus('failed');
      setProcessing(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="form-step" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>
          {isPayLater ? 'Registration Submitted!' : 'Payment Successful!'}
        </h2>
        <p style={{ color: 'var(--muted-foreground)' }}>
          {isPayLater 
            ? 'Your registration details are saved. Please complete the payment later to confirm.' 
            : 'Your registration is complete. Redirecting to your dashboard...'}
        </p>
      </div>
    );
  }

  return (
    <div className="form-step">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>Total Registration Fee</h3>
        <h1 style={{ fontSize: '3rem', color: 'var(--foreground)' }}>₹{fee}</h1>
        {isPayLater && (
          <p style={{ color: 'var(--warning)', marginTop: '0.5rem', fontWeight: 500 }}>
            Status: Payment Pending
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontWeight: 500, marginBottom: '1rem' }}>
          {isPayLater ? 'Confirm Submission' : 'Complete Registration'}
        </p>
        
        <button 
          onClick={handleSubmit} 
          disabled={processing}
          className={`btn ${isPayLater ? 'btn-secondary' : 'btn-primary'}`}
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}
        >
          {processing ? 'Submitting...' : (isPayLater ? 'Submit Registration' : 'Pay & Register')}
        </button>
      </div>
      
      {status === 'failed' && (
        <p className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>{errorMsg}</p>
      )}

      <div className="step-actions" style={{ marginTop: '3rem' }}>
        <button type="button" onClick={onBack} disabled={processing} className="btn btn-outline">Back</button>
      </div>
    </div>
  );
}
