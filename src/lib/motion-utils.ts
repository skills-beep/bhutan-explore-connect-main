/**
 * Premium Motion Animation Utilities using Motion One
 * Provides reusable animation configurations for smooth, premium effects
 */
import { animate, stagger, inView } from 'motion';

/**
 * Scroll-triggered element reveal with fade and slide
 */
export const createScrollReveal = (element: Element, options = {}) => {
  const defaultOptions = {
    duration: 0.8,
    delay: 0,
    y: 40,
    opacity: [0, 1],
    ...options,
  };

  return inView(element, () => {
    return animate(element, {
      opacity: defaultOptions.opacity[1],
      y: 0,
    }, {
      duration: defaultOptions.duration,
      delay: defaultOptions.delay,
    });
  }, {
    margin: '-50px',
  });
};

/**
 * Staggered children animation
 */
export const createStaggerChildren = (container: Element, options = {}) => {
  const defaultOptions = {
    duration: 0.6,
    delay: 0.1,
    y: 20,
    ...options,
  };

  const children = Array.from(container.children) as Element[];
  
  return animate(children, {
    opacity: [0, 1],
    y: [defaultOptions.y, 0],
  }, {
    duration: defaultOptions.duration,
    delay: stagger(defaultOptions.delay),
  });
};

/**
 * Parallax scroll effect
 */
export const createParallax = (element: Element, speed = 0.5) => {
  return inView(element, () => {
    const handler = () => {
      const rect = element.getBoundingClientRect();
      const scrollPercent = 1 - (rect.top / window.innerHeight);
      const offset = scrollPercent * (100 * speed);
      
      (element as HTMLElement).style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  });
};

/**
 * Smooth number counter animation
 */
export const createCounter = (
  element: HTMLElement,
  target: number,
  options = {},
) => {
  const defaultOptions = {
    duration: 2,
    ...options,
  };

  let current = 0;
  const increment = target / (defaultOptions.duration * 60);

  const tick = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toString();
      requestAnimationFrame(tick);
    } else {
      element.textContent = target.toString();
    }
  };

  return inView(element, () => {
    tick();
  });
};

/**
 * Hover scale effect
 */
export const createHoverScale = (element: Element, scale = 1.05) => {
  element.addEventListener('mouseenter', () => {
    animate(element, { scale }, { duration: 0.3 });
  });

  element.addEventListener('mouseleave', () => {
    animate(element, { scale: 1 }, { duration: 0.3 });
  });
};

/**
 * Text reveal animation (word by word)
 */
export const createTextReveal = (element: HTMLElement, options = {}) => {
  const defaultOptions = {
    duration: 0.05,
    delay: 0.02,
    ...options,
  };

  const words = element.textContent?.split(' ') || [];
  element.innerHTML = words
    .map((word) => `<span style="opacity: 0; display: inline-block;">${word}</span> `)
    .join('');

  const spans = Array.from(element.querySelectorAll('span')) as Element[];

  return animate(spans, { opacity: 1 }, {
    duration: defaultOptions.duration,
    delay: stagger(defaultOptions.delay),
  });
};

/**
 * Background gradient animation
 */
export const createGradientAnimation = (element: HTMLElement, colors: string[]) => {
  let current = 0;
  const animate_gradient = () => {
    const from = colors[current];
    const to = colors[(current + 1) % colors.length];
    
    element.style.background = `linear-gradient(135deg, ${from}, ${to})`;
    current = (current + 1) % colors.length;
  };

  setInterval(animate_gradient, 3000);
};

/**
 * Blob animation effect
 */
export const createBlobAnimation = (element: HTMLElement) => {
  animate(element, {
    borderRadius: ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 30% 70% 70%', '30% 70% 70% 30%'],
  }, {
    duration: 8,
    repeat: Infinity,
  });
};

/**
 * Floating animation
 */
export const createFloatingAnimation = (element: HTMLElement, distance = 20) => {
  animate(element, {
    y: [0, -distance, 0],
  }, {
    duration: 3,
    repeat: Infinity,
  });
};

/**
 * Pulse animation
 */
export const createPulseAnimation = (element: HTMLElement, scale = 1.05) => {
  animate(element, {
    scale: [1, scale, 1],
    opacity: [0.8, 1, 0.8],
  }, {
    duration: 2,
    repeat: Infinity,
  });
};

/**
 * Glow effect animation
 */
export const createGlowAnimation = (element: HTMLElement) => {
  animate(element, {
    boxShadow: [
      '0 0 5px rgba(59, 130, 246, 0)',
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 5px rgba(59, 130, 246, 0)',
    ],
  }, {
    duration: 2,
    repeat: Infinity,
  });
};

/**
 * Entrance animation with multiple effects
 */
export const createEntranceAnimation = (element: Element, type: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' = 'fade') => {
  const animations: Record<string, any> = {
    fade: { opacity: [0, 1] },
    slideUp: { opacity: [0, 1], y: [40, 0] },
    slideDown: { opacity: [0, 1], y: [-40, 0] },
    slideLeft: { opacity: [0, 1], x: [40, 0] },
    slideRight: { opacity: [0, 1], x: [-40, 0] },
    scale: { opacity: [0, 1], scale: [0.8, 1] },
  };

  return inView(element, () => {
    return animate(element, animations[type] || animations.fade, {
      duration: 0.7,
    });
  });
};

/**
 * 3D Motion Utilities - Advanced Depth & Perspective Effects
 */

/**
 * 3D card hover effect with perspective
 */
export const create3DCardHover = (element: HTMLElement) => {
  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    const rotateX = ((yPercent - 50) / 50) * -10;
    const rotateY = ((xPercent - 50) / 50) * 10;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
  };

  const onMouseLeave = () => {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * 3D floating animation
 */
export const create3DFloating = (element: HTMLElement, options = {}) => {
  const defaultOptions = {
    duration: 4,
    distance: 30,
    rotateX: 5,
    ...options,
  };

  return animate(element, {
    y: [0, -defaultOptions.distance, 0],
    rotateX: [0, defaultOptions.rotateX, 0],
  }, {
    duration: defaultOptions.duration,
    repeat: Infinity,
  });
};

/**
 * Parallax 3D scroll effect
 */
export const create3DParallax = (element: HTMLElement, speed = 0.5) => {
  return inView(element, () => {
    const handler = () => {
      const rect = element.getBoundingClientRect();
      const scrollPercent = 1 - (rect.top / window.innerHeight);
      const offset = scrollPercent * (100 * speed);
      const rotateX = scrollPercent * 10;
      
      element.style.transform = `translateY(${offset}px) rotateX(${rotateX}deg) translateZ(0)`;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  });
};

/**
 * 3D scale and depth animation
 */
export const create3DScale = (element: HTMLElement, options = {}) => {
  const defaultOptions = {
    duration: 3,
    minScale: 0.9,
    maxScale: 1.1,
    depth: 50,
    ...options,
  };

  return animate(element, {
    scale: [defaultOptions.minScale, defaultOptions.maxScale, defaultOptions.minScale],
    rotateZ: [0, 10, 0],
  }, {
    duration: defaultOptions.duration,
    repeat: Infinity,
  });
};

/**
 * Tilt shift 3D effect
 */
export const createTiltShift3D = (element: HTMLElement) => {
  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotateX = (y - 0.5) * 20;
    const rotateY = (x - 0.5) * 20;
    
    element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`;
  };

  const onMouseLeave = () => {
    element.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
};

/**
 * Orbit 3D animation
 */
export const create3DOrbit = (element: HTMLElement, options = {}) => {
  const defaultOptions = {
    duration: 8,
    radius: 100,
    ...options,
  };

  return animate(element, {
    rotateX: [0, 360],
    rotateY: [0, 360],
    rotateZ: [0, 360],
  }, {
    duration: defaultOptions.duration,
    repeat: Infinity,
  });
};

/**
 * Depth blur motion effect
 */
export const createDepthBlurMotion = (element: HTMLElement) => {
  return animate(element, {
    opacity: [0.3, 1, 0.5],
    filter: ['blur(8px)', 'blur(0)', 'blur(4px)'],
  }, {
    duration: 3,
    repeat: Infinity,
  });
};

/**
 * Combine multiple 3D effects
 */
export const create3DCombo = (element: HTMLElement, effectType: 'lift' | 'tilt' | 'orbit' | 'float' = 'lift') => {
  const effects = {
    lift: () => create3DCardHover(element),
    tilt: () => createTiltShift3D(element),
    orbit: () => create3DOrbit(element),
    float: () => create3DFloating(element),
  };

  return effects[effectType]?.();
};
