"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/components/BackButton';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setMessage('Account verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 animate-fade-in">
        <BackButton />
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--foreground)]">
            Verify Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              required
              className="input-field text-center tracking-[1em] text-2xl font-bold"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm text-center">{message}</p>}

          <div>
            <button type="submit" disabled={loading || code.length < 6} className="btn btn-primary w-full flex justify-center">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
