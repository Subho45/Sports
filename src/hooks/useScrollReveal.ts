import { useEffect, useRef, RefObject } from 'react';

// Added | null to the RefObject return type
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    const element = ref.current;
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  return ref;
}