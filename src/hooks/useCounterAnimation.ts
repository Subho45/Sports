import { useEffect, useRef, useState } from 'react';

export function useCounterAnimation(targetValue: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime: number;
            let startValue = 0;
            
            const animateCount = (currentTime: number) => {
              if (!startTime) startTime = currentTime;
              const progress = Math.min((currentTime - startTime) / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentValue = Math.floor(easeOutQuart * targetValue);
              setCount(currentValue);
              
              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                setCount(targetValue);
              }
            };
            
            requestAnimationFrame(animateCount);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [targetValue, duration, hasAnimated]);
  
  return { count, elementRef };
}