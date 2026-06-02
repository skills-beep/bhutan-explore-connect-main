# 3D Motion Effects Guide

## Overview
Your website now includes comprehensive 3D motion effects and cinematic depth. This guide explains how to use them globally and on specific pages.

---

## 1. Global Styling Setup ✅

### Updated `index.css`
- Font: **Instrument Serif** is now the global body font
- All pages inherit this automatically
- Black background for premium cinematic look

### Updated `tailwind.config.ts`
- Added `font-serif` class (uses Instrument Serif)
- Use `className="font-serif"` on any element

```tsx
<h1 className="font-serif text-4xl">Premium Typography</h1>
```

---

## 2. Available CSS Classes for 3D Motion

### Perspective & Transform Setup
```css
.perspective-1000      /* 1000px perspective depth */
.perspective-2000      /* 2000px perspective depth */
.transform-3d          /* Enable 3D hardware acceleration */
```

### 3D Animation Classes
```css
.animate-rotate-3d-x    /* 360° rotation around X axis */
.animate-rotate-3d-y    /* 360° rotation around Y axis */
.animate-rotate-3d-z    /* 360° rotation around Z axis */

.animate-tilt-shift-x   /* Subtle X-axis tilt with depth */
.animate-tilt-shift-y   /* Subtle Y-axis tilt with depth */

.animate-float-3d       /* Floating with 3D depth movement */
.animate-card-3d        /* Card-style 3D hover animation */
.animate-pulse-3d       /* Pulsing with 3D scale */

.animate-spin-3d        /* Orbital 3D rotation */
.animate-depth-blur     /* Depth-based motion blur */
```

### Hover & Interaction Effects
```css
.hover-lift-3d          /* Lifts on hover with 3D perspective */
.card-3d-hover          /* Cards tilt in 3D on hover */
.parallax-3d            /* Parallax scroll effect with 3D depth */
```

---

## 3. Using 3D Effects in React Components

### Basic Usage - Add Animation to Element

```tsx
import { useRef, useEffect } from 'react';
import { create3DCardHover, create3DFloating, create3DParallax } from '@/lib/motion-utils';

export const HeroSection = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 3D Card Hover Effect
    if (cardRef.current) {
      create3DCardHover(cardRef.current);
    }
  }, []);

  useEffect(() => {
    // 3D Floating Animation
    if (floatingRef.current) {
      create3DFloating(floatingRef.current, {
        duration: 4,
        distance: 30,
        rotateX: 5,
      });
    }
  }, []);

  useEffect(() => {
    // Parallax 3D on Scroll
    if (parallaxRef.current) {
      create3DParallax(parallaxRef.current, 0.5);
    }
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Card with 3D Hover Effect */}
      <div 
        ref={cardRef}
        className="perspective-1000 card-3d-hover p-8 rounded-lg bg-slate-900"
      >
        <h2>Move your mouse over me!</h2>
        <p>I'll tilt in 3D</p>
      </div>

      {/* Floating Element */}
      <div 
        ref={floatingRef}
        className="animate-float-3d perspective-1000 my-12"
      >
        <img src="hero-image.jpg" alt="Hero" className="rounded-lg" />
      </div>

      {/* Parallax Element */}
      <div 
        ref={parallaxRef}
        className="parallax-3d perspective-2000 mt-24"
      >
        <div className="h-96 bg-gradient-gold-orange rounded-lg">
          This element follows your scroll!
        </div>
      </div>
    </div>
  );
};
```

---

## 4. Available Motion Utilities

### `create3DCardHover(element)`
Makes elements tilt in 3D based on mouse position.

```tsx
const effect = create3DCardHover(element);
// Returns cleanup function
effect(); // Call to remove listener
```

### `create3DFloating(element, options)`
Creates floating animation with depth movement.

```tsx
create3DFloating(element, {
  duration: 4,        // Animation duration in seconds
  distance: 30,       // Y-axis movement distance
  rotateX: 5,         // X-axis rotation in degrees
});
```

### `create3DParallax(element, speed)`
Creates parallax scroll effect with 3D depth.

```tsx
create3DParallax(element, 0.5); // speed: 0-1
```

### `create3DScale(element, options)`
Animates scale with 3D depth.

```tsx
create3DScale(element, {
  duration: 3,
  minScale: 0.9,
  maxScale: 1.1,
  depth: 50,
});
```

### `createTiltShift3D(element)`
Advanced 3D tilt following mouse movement.

```tsx
const cleanup = createTiltShift3D(element);
cleanup(); // Remove listeners
```

### `create3DOrbit(element, options)`
3D orbital rotation animation.

```tsx
create3DOrbit(element, {
  duration: 8,
  radius: 100,
});
```

### `createDepthBlurMotion(element)`
Motion with depth-based blur.

```tsx
createDepthBlurMotion(element);
```

### `create3DCombo(element, effectType)`
Combine multiple effects easily.

```tsx
create3DCombo(element, 'lift');    // Card lift effect
create3DCombo(element, 'tilt');    // Tilt effect
create3DCombo(element, 'orbit');   // Orbital motion
create3DCombo(element, 'float');   // Floating motion
```

---

## 5. Recommended Homepage Structure

```tsx
// src/pages/Index.tsx
import { useRef, useEffect } from 'react';
import PremiumCinematicHero from '@/components/PremiumCinematicHero';
import { create3DCardHover, create3DParallax, create3DFloating } from '@/lib/motion-utils';

export default function Index() {
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroImageRef.current) {
      create3DParallax(heroImageRef.current, 0.5);
    }
  }, []);

  useEffect(() => {
    if (featureCardsRef.current) {
      const cards = featureCardsRef.current.querySelectorAll('[data-3d-card]');
      cards.forEach(card => create3DCardHover(card as HTMLElement));
    }
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen">
        <PremiumCinematicHero />
      </section>

      {/* Feature Section with 3D Cards */}
      <section className="py-24">
        <div 
          ref={featureCardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              data-3d-card
              className="perspective-1000 card-3d-hover p-8 rounded-lg bg-slate-900"
            >
              <h3 className="font-serif text-2xl">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parallax Image Section */}
      <section className="py-24">
        <div 
          ref={heroImageRef}
          className="parallax-3d perspective-2000"
        >
          <img 
            src="bhutan-landscape.jpg" 
            alt="Bhutan" 
            className="w-full rounded-lg"
          />
        </div>
      </section>
    </div>
  );
}
```

---

## 6. CSS Class Examples in JSX

### Simple 3D Animation
```tsx
<div className="animate-float-3d perspective-1000">
  <img src="image.jpg" alt="Floating Image" />
</div>
```

### Hover Lift Effect
```tsx
<button className="hover-lift-3d px-6 py-3 rounded-lg">
  Click Me - I'll Lift on Hover!
</button>
```

### Parallax with Animation
```tsx
<div className="parallax-3d perspective-2000 animate-pulse-3d">
  <h2 className="font-serif text-5xl">Scroll & Watch</h2>
</div>
```

### Combined Effects
```tsx
<div className="card-3d-hover perspective-1000 animate-glow-pulse">
  <div className="gradient-gold-orange p-8 rounded-lg">
    Premium Content
  </div>
</div>
```

---

## 7. Best Practices

✅ **DO:**
- Use `perspective-1000` or `perspective-2000` on parent container
- Apply 3D effects sparingly for premium feel
- Combine with existing `.liquid-glass` classes
- Test on mobile devices (some 3D effects are GPU-intensive)
- Use `transform-3d` with `.perspective-1000` for performance

❌ **DON'T:**
- Apply too many 3D animations to the same element
- Use 3D effects on text-heavy sections
- Forget to set `transform-style: preserve-3d` on parent
- Ignore `prefers-reduced-motion` for accessibility

---

## 8. Performance Tips

1. **Hardware Acceleration**
   - Use `transform-3d` class on animated elements
   - Browsers automatically optimize these

2. **Mobile Optimization**
   - Disable hover-based 3D on touch devices
   - Use simpler animations on mobile
   - Consider CSS `@media (hover: hover)` query

3. **Animation Duration**
   - Shorter = smoother (2-4 seconds recommended)
   - Avoid rapid successive animations

4. **Browser Support**
   - Works on all modern browsers
   - Falls back gracefully on older browsers

---

## 9. Accessibility

All 3D effects respect `prefers-reduced-motion`:
- Animations are reduced to 0.01ms if user has motion preferences
- Text remains readable
- Interactive elements remain functional

---

## 10. Global Consistency

### Font Consistency
```css
/* All pages inherit Instrument Serif from body */
body {
  font-family: 'Instrument Serif', serif;
  background: black;
}
```

### Gradient Consistency
```tsx
/* Use existing gradient classes */
<div className="gradient-gold-orange">Premium Section</div>
<div className="gradient-warm-glow">Accent Section</div>
<div className="gradient-blue-purple">Feature Section</div>
```

### Shadow Consistency
```tsx
<div className="shadow-cinematic rounded-lg">
  Deep cinematic shadows
</div>
```

---

## 11. Testing Your 3D Effects

```tsx
// Test component
import { useRef, useEffect } from 'react';
import { create3DCardHover } from '@/lib/motion-utils';

export const Test3D = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) create3DCardHover(ref.current);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div
        ref={ref}
        className="perspective-1000 card-3d-hover p-12 bg-slate-900 rounded-lg"
      >
        <h2 className="font-serif text-white text-3xl">
          Move your mouse - I tilt in 3D!
        </h2>
      </div>
    </div>
  );
};
```

---

## Quick Reference

| Effect | Class | Method | Best For |
|--------|-------|--------|----------|
| **Hover Lift** | `.hover-lift-3d` | `create3DCardHover()` | Buttons, Cards |
| **Floating** | `.animate-float-3d` | `create3DFloating()` | Images, Icons |
| **Parallax** | `.parallax-3d` | `create3DParallax()` | Backgrounds, Sections |
| **Tilt** | `.card-3d-hover` | `createTiltShift3D()` | Interactive Elements |
| **Rotate** | `.animate-rotate-3d-*` | CSS Class | Logos, Decorations |
| **Orbit** | `.animate-spin-3d` | `create3DOrbit()` | Feature Highlights |

---

## Support

For questions or issues with 3D effects:
1. Check browser DevTools (F12)
2. Verify `perspective` classes are applied
3. Test with reduced motion disabled
4. Check console for JavaScript errors

---

**Last Updated:** June 2026
**Version:** 1.0
