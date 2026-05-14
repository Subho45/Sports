"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: 'ATHLETE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create account');

      // Go to OTP page
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card glass-card animate-fade-in">
          <BackButton />
          <div className="text-center">
            <div className="icon-wrapper">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="auth-title">
              Join SPORVIA
            </h2>
            <p className="auth-subtitle">
              Create your account to join the SPORVIA community.
            </p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-gray-200">Role</label>
                <div className="relative">
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className="form-control prominent-select"
                  >
                    <option value="ATHLETE">Athlete / Participant</option>
                    <option value="COACH">Coach / Trainer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="input-field prominent-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field prominent-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Mobile Number</label>
                <input
                  name="mobileNumber"
                  type="tel"
                  required
                  className="input-field prominent-input"
                  placeholder="9999999999"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-semibold mb-2 text-[var(--muted-foreground)]">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field prominent-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary btn-submit"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Account...
                  </>
                ) : 'Sign Up & Send OTP'}
              </button>
            </div>
            
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <a href="/login" className="auth-link">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .signup-page-wrapper {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/image2.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          overflow: hidden;
        }
        .auth-background {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 0;
        }
        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          filter: blur(80px);
          opacity: 0.15;
          border-radius: 50%;
        }
        .blob-1 {
          background: var(--primary);
          top: -100px;
          right: -100px;
        }
        .blob-2 {
          background: var(--secondary);
          bottom: -100px;
          left: -100px;
        }
        .prominent-input, .prominent-select {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid var(--glass-border) !important;
          padding: 0.875rem 1.25rem !important;
          border-radius: 12px !important;
          font-size: 1rem !important;
          color: white !important;
        }
        .prominent-input:focus, .prominent-select:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%) !important;
          border: none !important;
          box-shadow: 0 10px 20px -10px var(--primary) !important;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -10px var(--primary) !important;
        }
        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 3rem 1rem;
          position: relative;
          z-index: 10;
        }
        .auth-card {
          width: 100%;
          max-width: 28rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .text-center {
          text-align: center;
        }
        .icon-wrapper {
          display: inline-block;
          padding: 0.75rem;
          border-radius: 1rem;
          background: linear-gradient(to top right, var(--primary), var(--secondary));
          margin-bottom: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .auth-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .auth-subtitle {
          color: #e5e7eb;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .auth-form {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--muted);
        }
        .input-field, .form-control {
          width: 100%;
          box-sizing: border-box;
          outline: none;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.5);
          border-radius: 0.5rem;
          padding: 0.75rem;
        }
        .error-message p {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          font-weight: 500;
        }
        .btn-submit {
          width: 100%;
          padding: 1rem;
          font-size: 1.125rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .loading-spinner {
          border-radius: 50%;
          height: 1rem;
          width: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--muted);
        }
        .auth-link {
          color: var(--primary);
          font-weight: 700;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
