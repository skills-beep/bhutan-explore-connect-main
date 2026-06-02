/**
 * React Hooks for Motion One animations
 * Simplifies integration of premium motion effects in components
 */
import { useEffect, useRef } from 'react';
import { animate, inView, stagger } from 'motion';

/**
 * Hook for scroll-triggered reveal animations
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const defaultOptions = {
      duration: 0.8,
      delay: 0,
      y: 40,
      ...options,
    };

    const cleanup = inView(element, () => {
      return animate(element, {
        opacity: [0, 1],
        y: [defaultOptions.y, 0],
      }, {
        duration: defaultOptions.duration,
        delay: defaultOptions.delay,
      });
    }, {
      margin: '-50px',
    });

    return () => cleanup?.();
  }, []);

  return ref;
};

/**
 * Hook for staggered children animations
 */
export const useStaggerChildren = (options = {}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;
    const defaultOptions = {
      duration: 0.6,
      delay: 0.1,
      y: 20,
      ...options,
    };

    const children = Array.from(container.children) as Element[];

    const cleanup = inView(container, () => {
      return animate(children, {
        opacity: [0, 1],
        y: [defaultOptions.y, 0],
      }, {
        duration: defaultOptions.duration,
        delay: stagger(defaultOptions.delay),
      });
    }, {
      margin: '-50px',
    });

    return () => cleanup?.();
  }, []);

  return ref;
};

/**
 * Hook for parallax scroll effects
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handler = () => {
      const rect = element.getBoundingClientRect();
      const scrollPercent = 1 - (rect.top / window.innerHeight);
      const offset = scrollPercent * (100 * speed);
      
      element.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [speed]);

  return ref;
};

/**
 * Hook for counter animations
 */
export const useCounter = (target: number, options = {}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const defaultOptions = {
      duration: 2,
      ...options,
    };

    let current = 0;
    const increment = target / (defaultOptions.duration * 60);

    const cleanup = inView(element, () => {
      const tick = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toString();
          requestAnimationFrame(tick);
        } else {
          element.textContent = target.toString();
        }
      };
      tick();
    });

    return () => cleanup?.();
  }, [target, options.duration]);

  return ref;
};

/**
 * Hook for hover scale effects
 */
export const useHoverScale = (scale = 1.05) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      animate(element, { scale }, { duration: 0.3 });
    };

    const handleMouseLeave = () => {
      animate(element, { scale: 1 }, { duration: 0.3 });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scale]);

  return ref;
};

/**
 * Hook for floating animations
 */
export const useFloating = (distance = 20, duration = 3) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = animate(ref.current, {
      y: [0, -distance, 0],
    }, {
      duration,
      repeat: Infinity,
    });

    return () => animation.cancel?.();
  }, [distance, duration]);

  return ref;
};

/**
 * Hook for pulse animations
 */
export const usePulse = (scale = 1.05) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = animate(ref.current, {
      scale: [1, scale, 1],
      opacity: [0.8, 1, 0.8],
    }, {
      duration: 2,
      repeat: Infinity,
    });

    return () => animation.cancel?.();
  }, [scale]);

  return ref;
};

/**
 * Hook for glow effects
 */
export const useGlow = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animation = animate(ref.current, {
      boxShadow: [
        '0 0 5px rgba(59, 130, 246, 0)',
        '0 0 20px rgba(59, 130, 246, 0.5)',
        '0 0 5px rgba(59, 130, 246, 0)',
      ],
    }, {
      duration: 2,
      repeat: Infinity,
    });

    return () => animation.cancel?.();
  }, []);

  return ref;
};

/**
 * Hook for text reveal animations
 */
export const useTextReveal = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const words = element.textContent?.split(' ') || [];
    element.innerHTML = words
      .map((word) => `<span style="opacity: 0; display: inline-block;">${word}</span> `)
      .join('');

    const spans = Array.from(element.querySelectorAll('span')) as Element[];

    const cleanup = inView(element, () => {
      return animate(spans, { opacity: 1 }, {
        duration: 0.05,
        delay: stagger(0.02),
      });
    });

    return () => cleanup?.();
  }, []);

  return ref;
};

/**
 * Hook for blob animations
 */
export const useBlob = (duration = 8) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const cleanup = animate(ref.current, {
      borderRadius: ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 30% 70% 70%', '30% 70% 70% 30%'],
    }, {
      duration,
      repeat: Infinity,
    });

    return () => cleanup?.();
  }, [duration]);

  return ref;
};

/**
 * Hook for entrance animations
 */
export const useEntrance = (type: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' = 'fade') => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const animations: Record<string, any> = {
      fade: { opacity: [0, 1] },
      slideUp: { opacity: [0, 1], y: [40, 0] },
      slideDown: { opacity: [0, 1], y: [-40, 0] },
      slideLeft: { opacity: [0, 1], x: [40, 0] },
      slideRight: { opacity: [0, 1], x: [-40, 0] },
      scale: { opacity: [0, 1], scale: [0.8, 1] },
    };

    const cleanup = inView(element, () => {
      return animate(element, animations[type] || animations.fade, {
        duration: 0.7,
      });
    });

    return () => cleanup?.();
  }, [type]);

  return ref;
};
