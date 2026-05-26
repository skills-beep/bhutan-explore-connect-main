# Premium Cinematic Hero Component Documentation

## Overview

The `PremiumCinematicHero` component creates a modern, cinematic hero section with advanced layered depth masking effects. It's designed for premium travel websites with an Apple-style aesthetic and includes sophisticated text layering where content appears to interact with the background subject.

## Key Features

### 1. **Advanced Depth Masking**
- Text split into two layers: "The last" and "Shangri-La"
- "The last" remains in front (bold, white, modern sans-serif)
- "Shangri-La" passes behind visual elements (italic, golden-orange gradient)
- Creates illusion of 3D depth where text feels physically embedded in the scene

### 2. **Responsive Design**
- Mobile-first composition
- Adapts typography and spacing for all screen sizes
- Touch-optimized buttons and interactions
- Maintains readability on all devices

### 3. **Performance Optimized**
- Hardware-accelerated animations using `transform3d`
- Minimal repaints with `will-change` declarations
- Lazy loading for images
- Optimized Framer Motion transitions

### 4. **Premium Visual Effects**
- Atmospheric glow effects (blue, orange, golden)
- Cinematic blur and shadow effects
- Gradient text with smooth rendering
- Smooth parallax scrolling
- Deep shadow and depth layers

## Component Structure

```
PremiumCinematicHero
├── Background Layer (Parallax)
│   ├── Image with darkened overlay
│   ├── Vignette gradient
│   └── SVG filters for effects
├── Atmospheric Glows
│   ├── Blue glow (top-left)
│   ├── Orange glow (bottom-right)
│   └── Golden accent (center)
└── Content Container
    ├── Decorative divider
    ├── Main headline with depth
    │   ├── "The last" (white)
    │   └── "Shangri-La" (gradient)
    ├── Subheading
    ├── CTA buttons
    └── Scroll indicator
```

## Masking Techniques Explained

### Text Depth Layering

The component uses CSS gradients and filters to create the depth effect:

```css
/* "Shangri-La" appears to go behind elements */
filter: drop-shadow(0 4px 20px rgba(249, 115, 22, 0.4));
background-image: linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #fb923c 70%, #ea580c 100%);
```

### SVG Filters

Embedded SVG filters provide:
- **Glow Effect**: Adds depth and softness
- **Cinematic Blur**: Subtle motion blur
- **Deep Shadow**: Multi-layer shadow system
- **Text Glow**: Warm, integrated text effects

### Atmospheric Effects

Three layered glow elements create cinematic depth:
```javascript
// Blue glow - top-left
<motion.div className="radial-glow-blue" />

// Orange glow - bottom-right  
<motion.div className="radial-glow-orange" />

// Golden accent - center
<motion.div className="radial-glow-center" />
```

## Scroll Animations

The hero responds to scroll position:

```javascript
const { scrollYProgress } = useScroll({
  target: heroRef,
  offset: ["start start", "end start"],
});

// Background scales and moves during scroll
const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

// Content fades and moves up
const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 30]);
```

## Customization Guide

### Changing the Hero Image

Update the import in `PremiumCinematicHero.tsx`:

```typescript
import festivalMask from "@/assets/festival-mask-1.png";
// Change to:
import festivalMask from "@/assets/your-dancer-image.png";
```

### Modifying Text

Edit the headline text in the component:

```typescript
<motion.h1>The last</motion.h1>
<motion.h2>Shangri-La</motion.h2>
```

### Customizing Gradients

Adjust the golden-orange gradient for "Shangri-La":

```typescript
style={{
  backgroundImage:
    "linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #fb923c 70%, #ea580c 100%)",
}}
```

Change color stops:
- `#fbbf24` - Golden yellow
- `#f97316` - Orange
- `#fb923c` - Light orange
- `#ea580c` - Deep orange

### Adjusting Atmospheric Glows

Modify glow opacity and colors in the `<motion.div>` elements:

```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 0.15 }} // Adjust glow intensity
transition={{ duration: 2 }}
className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-radial from-blue-500 via-purple-500 to-transparent blur-3xl"
```

### Modifying Button Styles

Edit the CTA buttons:

```typescript
<Button
  size="lg"
  className="bg-white text-black hover:bg-gray-100..." // Customize here
/>
```

## Advanced Features

### Foreground Detection Algorithm

The `AdvancedMaskingLayer` component includes sophisticated foreground detection:

```typescript
// K-means clustering for color analysis
const enhancedForegroundDetection = (imageData, width, height) => {
  // 1. Sample colors from image
  // 2. Extract dominant colors (costume colors)
  // 3. Classify pixels based on similarity
  // 4. Apply morphological operations (dilation + erosion)
  // 5. Feather edges for smooth blending
};
```

### Mobile Optimization

The component includes responsive adjustments:
- Smaller headline font on mobile (5xl on sm, 7xl on md, 8xl on lg)
- Adjusted spacing and gaps
- Touch-friendly button sizes
- Optimized text shadows for mobile displays

### Accessibility Features

- Respects `prefers-reduced-motion` setting
- Respects `prefers-contrast` setting
- Respects `prefers-color-scheme` setting
- High contrast text and buttons
- Semantic HTML structure

## Performance Considerations

### CSS Optimizations
```css
/* Hardware acceleration */
.cinematic-hero {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Prevents layout shifts */
html {
  scrollbar-gutter: stable;
}
```

### Image Optimization
- Use WebP or AVIF formats when possible
- Set appropriate loading="eager" for hero images
- Optimize image size before deployment
- Use CDN for faster delivery

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with -webkit prefixes)
- Mobile browsers: Full support with responsive optimizations

## Common Issues & Solutions

### Text Appears Blurry
- Ensure `text-rendering: optimizeLegibility;` is applied
- Check `-webkit-font-smoothing: antialiased;`
- Verify subpixel rendering settings

### Gradient Text Not Showing
- Verify `-webkit-background-clip: text;` is present
- Check `-webkit-text-fill-color: transparent;`
- Ensure `background-clip: text;` fallback is included

### Glow Effects Not Visible
- Check opacity values (try increasing from 0.12 to 0.25)
- Verify `blur-3xl` class is applied
- Ensure browser supports backdrop filters

### Performance Issues on Mobile
- Reduce glow effect opacity
- Disable some scroll animations on mobile
- Use `will-change` sparingly
- Optimize image file sizes

## Integration Steps

1. **Component already placed in Index.tsx**:
   ```typescript
   import PremiumCinematicHero from "@/components/PremiumCinematicHero";
   
   <PremiumCinematicHero />
   ```

2. **CSS imported in index.css**:
   ```css
   @import "./styles/cinematic-depth.css";
   ```

3. **Responsive images configured**: All images use proper loading attributes

4. **Animations optimized**: Framer Motion handles all transitions

## Typography Stack

- **Headlines**: SF Pro Display, -apple-system, BlinkMacSystemFont
- **Body**: Inter, sans-serif
- **Fallback**: System fonts ensure consistent rendering

## Color System

### Primary Colors
- **White**: `#ffffff` - Foreground text
- **Golden-Orange**: `#fbbf24` → `#ea580c` - Gradient text
- **Black**: `#000000` - Background

### Overlay Colors
- **Dark Overlay**: `rgba(0, 0, 0, 0.4-0.6)` - For readability
- **Blue Glow**: `rgba(59, 130, 246, 0.15)` - Atmospheric depth
- **Orange Glow**: `rgba(249, 115, 22, 0.12)` - Atmospheric depth
- **Golden Glow**: `rgba(251, 191, 36, 0.1)` - Center accent

## Future Enhancement Ideas

1. **Animated Background**: Add subtle animation loops to the background
2. **Interactive Parallax**: Detect mouse position for interactive depth
3. **Video Background**: Replace static image with video for more dynamic effect
4. **Voice Navigation**: Add audio guide option
5. **Multiple Language Support**: Internationalize headline and copy
6. **Dark Mode Toggle**: Add theme switching capability
7. **Advanced Analytics**: Track engagement metrics
8. **Personalization**: Custom messages based on user data

## Resources

- Framer Motion Docs: https://www.framer.com/motion/
- Tailwind CSS: https://tailwindcss.com/
- CSS Masking: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Masking
- Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

## Support & Troubleshooting

For issues or questions:
1. Check browser console for errors
2. Verify all imports are correct
3. Ensure Tailwind CSS is properly configured
4. Test in different browsers
5. Check image file paths
6. Verify CSS is loaded correctly

---

**Last Updated**: May 2026
**Version**: 1.0
**Status**: Production Ready
