"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AthleteDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);

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

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/athlete/registration');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user]);

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
          <h1 className="text-3xl font-bold">Athlete Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-destructive btn-sm">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="profile-summary glass-card p-6 border border-[var(--glass-border)]">
            <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Personal Profile</h2>
            <div className="space-y-3">
              <p><span className="text-[var(--muted-foreground)]">Full Name:</span> <br/><span className="text-xl font-medium">{user?.fullName}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Email:</span> <br/><span>{user?.email}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Mobile:</span> <br/><span>{user?.mobileNumber}</span></p>
              <p><span className="text-[var(--muted-foreground)]">Account Status:</span> <br/>
                <span className={`status-badge ${user?.isVerified ? 'approved' : 'pending'}`}>
                  {user?.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </p>
            </div>
          </div>

          <div className="registration-status glass-card p-6 border border-[var(--glass-border)]">
            <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Competition Registration</h2>
            <p className="mb-6 text-[var(--muted-foreground)]">Complete your athlete profile and document verification to participate in upcoming competitions.</p>
            
            <Link href="/register" className="btn btn-primary w-full block text-center">
              Complete 8-Step Registration
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          {registrations.length === 0 ? (
            <div className="glass-card p-4 text-center text-[var(--muted-foreground)] border border-dashed border-[var(--glass-border)]">
              No registration history found. Complete your registration to see activities here.
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map(reg => (
                <div key={reg.id} className="glass-card p-4 border border-[var(--glass-border)] flex justify-between items-center animate-slide-up">
                  <div>
                    <h3 className="font-semibold text-lg">{reg.fullName} - {reg.ageGroupApplied}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Submitted on {new Date(reg.createdAt).toLocaleDateString()} at {new Date(reg.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs mt-1">Level: {reg.categoryLevel}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-2 justify-end">
                      <span className={`status-badge ${reg.paymentStatus === 'PAID' ? 'approved' : 'pending'}`}>
                        Payment: {reg.paymentStatus}
                      </span>
                      <span className={`status-badge ${reg.status.toLowerCase()}`}>
                        Status: {reg.status}
                      </span>
                    </div>
                    {reg.paymentStatus !== 'PAID' && (
                      <Link href="/register" className="text-xs text-[var(--primary)] font-semibold hover:underline">
                        Continue to Payment →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .container {
          min-height: 100vh;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .status-badge.approved {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

      `}</style>
    </div>
  );
}
