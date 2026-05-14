import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            entry.target.classList.add('scroll-reveal');
            setHasAnimated(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return elementRef;
}