"use client";

import React, { useEffect, useState } from 'react';

export default function FloatingOrbs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="floating-orbs" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <div 
        className="orb orb-1"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      />
      <div 
        className="orb orb-2"
        style={{
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
        }}
      />
      <div className="orb orb-3" />
    </div>
  );
}