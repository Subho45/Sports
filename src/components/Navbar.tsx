"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMagneticButton } from '@/hooks/useMagneticButton';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  
  const logoutBtnRef = useMagneticButton<HTMLButtonElement>();

  useEffect(() => {
    checkAuth();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  return (
    <header className={`navbar glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link href="/" className="navbar-logo link-underline">
          <span className="logo-accent text-gradient-animated">SPOR</span>VIA
        </Link>
        
        <nav className="navbar-links">
          {user ? (
            <>
              {user.role === 'ADMIN' ? (
                <Link href="/admin/dashboard" className="nav-link">Admin Panel</Link>
              ) : user.role === 'COACH' ? (
                <Link href="/coach/dashboard" className="nav-link">Coach Portal</Link>
              ) : (
                <>
                  <Link href="/register" className="nav-link">Registration</Link>
                  <Link href="/athlete/dashboard" className="nav-link">My Profile</Link>
                </>
              )}
              <button 
                ref={logoutBtnRef}
                onClick={handleLogout}
                className="btn btn-outline btn-sm logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="auth-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link href="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem' }}>Join Now</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}