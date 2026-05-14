"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '', // email or mobile
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.unverified) {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      // Successful login
      if (data.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.role === 'COACH') {
        router.push('/coach/dashboard');
      } else {
        router.push('/athlete/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-background" />
      <div className="auth-container">
        <div className="auth-card glass-card animate-fade-in">
          <BackButton />
          <div className="text-center">
            <h2 className="auth-title">
              Welcome Back
            </h2>
            <p className="auth-subtitle">
              Sign in to your SPORVIA account
            </p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-group">
                <input
                  name="identifier"
                  type="text"
                  required
                  className="input-field prominent-input"
                  placeholder="Email or Mobile Number"
                  value={formData.identifier}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field prominent-input"
                  placeholder="Password"
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
              <button type="submit" disabled={loading} className="btn btn-primary btn-submit">
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </div>
            
            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <a href="/signup" className="auth-link">
                  Sign up
                </a>
              </p>
              
              <div className="admin-portal-link">
                <a 
                  href="/admin/login" 
                  className="btn btn-outline"
                >
                  🔐 Admin Login Portal
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-background {
          position: fixed;
          inset: 0;
          background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/image2.png');
          background-size: cover;
          background-position: center;
          z-index: -1;
        }
        .prominent-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          padding: 1rem !important;
        }
        .prominent-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
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
          margin-top: 1rem;
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
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .auth-link {
          color: var(--primary);
          font-weight: 700;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
        .admin-portal-link {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
}
