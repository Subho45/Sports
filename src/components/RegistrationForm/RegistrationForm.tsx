"use client";

import React, { useState, useEffect } from 'react';
import './register.css';
import PersonalDetails from '@/components/RegistrationForm/steps/PersonalDetails';
import GuardianDetails from '@/components/RegistrationForm/steps/GuardianDetails';
import AddressDetails from '@/components/RegistrationForm/steps/AddressDetails';
import ClubDetails from '@/components/RegistrationForm/steps/ClubDetails';
import CompetitionDetails from '@/components/RegistrationForm/steps/CompetitionDetails';
import DocumentUpload from '@/components/RegistrationForm/steps/DocumentUpload';
import Consent from '@/components/RegistrationForm/steps/Consent';
import Payment from '@/components/RegistrationForm/steps/Payment';

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [formData, setFormData] = useState<any>({
    personal: {},
    guardian: {},
    address: {},
    club: {},
    competition: {},
    documents: {},
    consent: false
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setFormData((prev: any) => ({
            ...prev,
            personal: {
              ...prev.personal,
              fullName: data.user.fullName,
              email: data.user.email,
              mobile: data.user.mobileNumber
            }
          }));
        }
      } catch (err) {
        console.error("Failed to fetch session for pre-fill", err);
      }
    }
    checkSession();
  }, []);

  const handleNext = (stepData: any, stepKey: string) => {
    setFormData((prev: any) => ({ ...prev, [stepKey]: stepData }));
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const stepTitles = [
    "Personal Details",
    "Guardian Details",
    "Address Details",
    "Club / Representation",
    "Competition Details",
    "Document Upload",
    "Declaration & Consent",
    "Payment"
  ];

  return (
    <div className="registration-container glass-card animate-fade-in">
      <div className="registration-header">
        <h2>Athlete Registration</h2>
        <p className="step-indicator">Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</p>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="registration-content">
        {currentStep === 1 && <PersonalDetails data={formData.personal} onNext={(d: any) => handleNext(d, 'personal')} />}
        {currentStep === 2 && <GuardianDetails data={formData.guardian} onNext={(d: any) => handleNext(d, 'guardian')} onBack={handleBack} />}
        {currentStep === 3 && <AddressDetails data={formData.address} onNext={(d: any) => handleNext(d, 'address')} onBack={handleBack} />}
        {currentStep === 4 && <ClubDetails data={formData.club} onNext={(d: any) => handleNext(d, 'club')} onBack={handleBack} />}
        {currentStep === 5 && <CompetitionDetails data={formData.competition} onNext={(d: any) => handleNext(d, 'competition')} onBack={handleBack} />}
        {currentStep === 6 && <DocumentUpload data={formData.documents} onNext={(d: any) => handleNext(d, 'documents')} onBack={handleBack} />}
        {currentStep === 7 && <Consent data={formData.consent} onNext={(d: any) => handleNext(d, 'consent')} onBack={handleBack} />}
        {currentStep === 8 && <Payment data={formData} onBack={handleBack} />}
      </div>
    </div>
  );
}
