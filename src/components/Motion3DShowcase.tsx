import { useRef, useEffect, useState } from 'react';
import {
  create3DCardHover,
  create3DFloating,
  create3DParallax,
  create3DScale,
  createTiltShift3D,
  create3DOrbit,
  createDepthBlurMotion,
} from '@/lib/motion-utils';

/**
 * 3D Motion Effects Showcase Component
 * Demonstrates all available 3D motion effects with examples
 */
export default function Motion3DShowcase() {
  const cardHoverRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const [activeEffect, setActiveEffect] = useState<string>('hover');

  // Card Hover Effect
  useEffect(() => {
    if (cardHoverRef.current) {
      return create3DCardHover(cardHoverRef.current);
    }
  }, []);

  // Floating Effect
  useEffect(() => {
    if (floatingRef.current) {
      create3DFloating(floatingRef.current, {
        duration: 4,
        distance: 30,
        rotateX: 5,
      });
    }
  }, []);

  // Parallax Effect
  useEffect(() => {
    if (parallaxRef.current) {
      create3DParallax(parallaxRef.current, 0.5);
    }
  }, []);

  // Scale Effect
  useEffect(() => {
    if (scaleRef.current) {
      create3DScale(scaleRef.current, {
        duration: 3,
        minScale: 0.95,
        maxScale: 1.1,
      });
    }
  }, []);

  // Tilt Effect
  useEffect(() => {
    if (tiltRef.current) {
      return createTiltShift3D(tiltRef.current);
    }
  }, []);

  // Orbit Effect
  useEffect(() => {
    if (orbitRef.current) {
      create3DOrbit(orbitRef.current, {
        duration: 8,
        radius: 100,
      });
    }
  }, []);

  // Depth Blur Motion
  useEffect(() => {
    if (depthRef.current) {
      createDepthBlurMotion(depthRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="font-serif text-6xl mb-4">3D Motion Effects</h1>
          <p className="text-xl text-gray-400">
            Interactive showcase of all available 3D cinematic effects
          </p>
        </div>

        {/* Effects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {/* 1. Card Hover Effect */}
          <div className="perspective-1000">
            <div
              ref={cardHoverRef}
              className="card-3d-hover bg-gradient-to-br from-blue-900 to-purple-900 p-12 rounded-lg cursor-move transition-all duration-300"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Card Hover</h3>
                <p className="text-gray-300 mb-4">Move your mouse over me</p>
                <div className="text-4xl">🎯</div>
              </div>
            </div>
          </div>

          {/* 2. Floating Effect */}
          <div className="perspective-1000">
            <div
              ref={floatingRef}
              className="bg-gradient-to-br from-orange-500 to-red-600 p-12 rounded-lg"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Floating</h3>
                <p className="text-gray-200 mb-4">Drifts through space</p>
                <div className="text-4xl">🚀</div>
              </div>
            </div>
          </div>

          {/* 3. Parallax Effect */}
          <div className="perspective-2000">
            <div
              ref={parallaxRef}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-12 rounded-lg"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Parallax</h3>
                <p className="text-gray-200 mb-4">Scroll to interact</p>
                <div className="text-4xl">📜</div>
              </div>
            </div>
          </div>

          {/* 4. Scale Effect */}
          <div className="perspective-1000">
            <div
              ref={scaleRef}
              className="bg-gradient-to-br from-pink-500 to-rose-600 p-12 rounded-lg"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Scale</h3>
                <p className="text-gray-200 mb-4">Pulses with depth</p>
                <div className="text-4xl">💎</div>
              </div>
            </div>
          </div>

          {/* 5. Tilt Effect */}
          <div className="perspective-1000">
            <div
              ref={tiltRef}
              className="bg-gradient-to-br from-indigo-500 to-blue-600 p-12 rounded-lg cursor-move"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Tilt</h3>
                <p className="text-gray-300 mb-4">Follow your mouse</p>
                <div className="text-4xl">🎪</div>
              </div>
            </div>
          </div>

          {/* 6. Orbit Effect */}
          <div className="perspective-1000">
            <div
              ref={orbitRef}
              className="bg-gradient-to-br from-yellow-500 to-amber-600 p-12 rounded-lg"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">3D Orbit</h3>
                <p className="text-gray-200 mb-4">Spins through space</p>
                <div className="text-4xl">🌍</div>
              </div>
            </div>
          </div>

          {/* 7. Depth Blur Effect */}
          <div className="perspective-1000">
            <div
              ref={depthRef}
              className="bg-gradient-to-br from-violet-500 to-purple-600 p-12 rounded-lg"
            >
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">Depth Blur</h3>
                <p className="text-gray-200 mb-4">Moves with blur</p>
                <div className="text-4xl">✨</div>
              </div>
            </div>
          </div>

          {/* 8. Hover Lift */}
          <div className="perspective-1000">
            <button className="hover-lift-3d w-full bg-gradient-to-br from-cyan-500 to-blue-600 p-12 rounded-lg font-serif text-2xl">
              <div className="text-center">
                <p className="mb-4">Hover Lift</p>
                <p className="text-sm text-gray-200 mb-4">Click to interact</p>
                <div className="text-4xl">⬆️</div>
              </div>
            </button>
          </div>

          {/* 9. Animation Classes */}
          <div className="perspective-1000">
            <div className="animate-float-3d bg-gradient-to-br from-green-500 to-emerald-600 p-12 rounded-lg">
              <div className="text-center">
                <h3 className="font-serif text-2xl mb-4">CSS Animation</h3>
                <p className="text-gray-200 mb-4">Float 3D class</p>
                <div className="text-4xl">🎨</div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-slate-900/50 rounded-lg p-12 border border-slate-700">
          <h2 className="font-serif text-3xl mb-6">How to Use These Effects</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">CSS Classes</h3>
              <p className="text-gray-300 mb-4">
                Apply animation classes directly to elements:
              </p>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                <code>{`<div className="animate-float-3d perspective-1000">
  Content here
</div>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">JavaScript Methods</h3>
              <p className="text-gray-300 mb-4">
                Use motion utilities in your components:
              </p>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                <code>{`useEffect(() => {
  create3DCardHover(element);
}, []);`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
              <li>✓ Hardware-accelerated 3D transforms</li>
              <li>✓ Smooth perspective effects</li>
              <li>✓ Mouse-interactive depth</li>
              <li>✓ Scroll-based parallax</li>
              <li>✓ Automatic performance optimization</li>
              <li>✓ Accessibility-aware (respects prefers-reduced-motion)</li>
            </ul>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="mt-24 bg-slate-900/50 rounded-lg p-12 border border-slate-700">
          <h2 className="font-serif text-3xl mb-6">Implementation Steps</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Import Effects</h3>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                <code>{`import { create3DCardHover } from '@/lib/motion-utils';`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. Create Ref & Effect</h3>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                <code>{`const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (ref.current) create3DCardHover(ref.current);
}, []);`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. Add Classes & Ref</h3>
              <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
                <code>{`<div ref={ref} className="perspective-1000 card-3d-hover">
  Your content
</div>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
