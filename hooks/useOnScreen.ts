import { useState, useEffect, useRef, RefObject } from 'react';

interface UseOnScreenOptions {
  threshold?: number;
  triggerOnce?: boolean;
}

export const useOnScreen = <T extends Element,>(options: UseOnScreenOptions = {}): [RefObject<T>, boolean] => {
  const { threshold = 0.1, triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
            setIntersecting(false)
        }
      },
      {
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold, triggerOnce]);

  return [ref, isIntersecting];
};
