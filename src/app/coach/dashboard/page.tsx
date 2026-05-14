"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CoachDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to fetch session", error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="glass-card p-8 animate-fade-in">
        <div className="flex justify-between items-center border-bottom pb-4 mb-6">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="profile-summary glass-card p-6 border border-[var(--glass-border)]">
            <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Coach Profile</h2>
            <div className="space-y-3">
              <p><span className="text-[var(--muted-foreground)]">Full Name:</span> <br/><span className="text-xl font-medium">{user?.fullName}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Email:</span> <br/><span>{user?.email}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Mobile:</span> <br/><span>{user?.mobileNumber}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Role:</span> <br/><span className="text-xl font-medium">Professional Coach</span></p>
            </div>
          </div>

          <div className="registration-status glass-card p-6 border border-[var(--glass-border)]">
            <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Coach Verification</h2>
            <p className="mb-6 text-[var(--muted-foreground)]">Please complete your professional profile and upload certifications to be verified by administrators.</p>
            
            <button className="btn btn-primary w-full" disabled>
              Complete Professional Onboarding (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
