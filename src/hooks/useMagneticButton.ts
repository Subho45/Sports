import { useRef, useEffect, RefObject } from 'react';

// Added | null to the RefObject return type to satisfy TypeScript
export function useMagneticButton<T extends HTMLElement = HTMLButtonElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 150;
        const strength = Math.max(0, 1 - distance / maxDistance);
        
        const moveX = x * strength * 0.3;
        const moveY = y * strength * 0.3;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    const handleMouseLeave = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      element.style.transform = 'translate(0px, 0px)';
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return ref;
}