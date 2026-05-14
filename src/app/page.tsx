"use client";

import Link from "next/link";
import "./home.css";
// Updated this to a standard Next.js path alias. 
// Ensure your file is located at src/components/Particles.tsx
import Particles from "@/components/Particles"; 
import { useEffect } from "react";
import { useMagneticButton } from "@/hooks/useMagneticButton";

export default function Home() {
  const magneticRef = useMagneticButton();
  
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });
    
    const scrollTargets = document.querySelectorAll('.scroll-reveal');
    scrollTargets.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Particles />
      <div className="home-container">
        <section className="hero-section glass-card animate-fade-in">
          <div className="hero-content">
            <h1 className="hero-title scroll-reveal">
              Where Champions <span className="text-accent">Begin.</span>
            </h1>
            <p className="hero-subtitle scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              The ultimate platform for athletes, coaches, and administrators to seamlessly manage registrations, competitions, and performance tracking.
            </p>
            <div className="hero-actions scroll-reveal" style={{ transitionDelay: '0.4s' }}>
              <Link 
                href="/signup" 
                ref={magneticRef as any} 
                className="btn btn-primary magnetic-btn glow-pulse"
              >
                🚀 Join as Athlete/Coach
              </Link>
              <Link href="/login" className="btn btn-outline">
                👤 Member Login
              </Link>
            </div>
          </div>
          
          <div className="hero-stats scroll-reveal" style={{ transitionDelay: '0.6s' }}>
            <div className="stat-card glass delay-100">
              <h3><span className="stat-number">500</span>+</h3>
              <p>ACTIVE ATHLETES</p>
            </div>
            <div className="stat-card glass delay-200">
              <h3><span className="stat-number">100</span>+</h3>
              <p>COMPETITIONS</p>
            </div>
            <div className="stat-card glass delay-300">
              <h3><span className="stat-number">12</span></h3>
              <p>SPORTS CATEGORIES</p>
            </div>
          </div>
        </section>

        <section className="features-section animate-fade-in delay-200">
          <h2 className="text-shimmer scroll-reveal">Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card glass-card scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="feature-icon">📝</div>
              <h3>Seamless Registration</h3>
              <p>A simple, 8-step process to get verified and ready for competitions.</p>
            </div>
            <div className="feature-card glass-card scroll-reveal" style={{ transitionDelay: '0.4s' }}>
              <div className="feature-icon">🏆</div>
              <h3>Competition Tracking</h3>
              <p>Live leaderboards, result tracking, and automated certificate generation.</p>
            </div>
            <div className="feature-card glass-card scroll-reveal" style={{ transitionDelay: '0.6s' }}>
              <div className="feature-icon">🔒</div>
              <h3>Secure Verification</h3>
              <p>Bank-grade security for document storage and verification workflows.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}