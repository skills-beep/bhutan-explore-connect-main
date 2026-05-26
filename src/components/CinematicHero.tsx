import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import festivalMask from "@/assets/festival-mask-1.png";

interface MaskData {
  canvas: HTMLCanvasElement;
  maskImageData: ImageData;
}

/**
 * Cinematic Hero Component with Advanced Layered Depth Masking
 * Creates a premium 3D effect where text interacts with a masked dancer subject
 */
const CinematicHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [maskData, setMaskData] = useState<MaskData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  /**
   * Automatic Foreground Detection using Color Analysis
   * Detects the dancer subject and creates a refined mask
   */
  const detectForegroundSubject = (
    imageData: ImageData,
    canvas: HTMLCanvasElement
  ): ImageData => {
    const data = imageData.data;
    const maskData = new ImageData(canvas.width, canvas.height);
    const maskPixels = maskData.data;

    // Color-based foreground detection
    // Identifies costume colors (reds, golds, greens) typical of Bhutanese dancers
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Detect costume colors (warm tones, vibrant colors)
      const brightness = (r + g + b) / 3;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);

      // Detect foreground: higher saturation, medium-to-dark colors typical of costumes
      const isForeground =
        saturation > 40 &&
        brightness > 30 &&
        brightness < 220 &&
        !(r > 200 && g > 200 && b > 200); // Exclude very light colors

      // Create soft feathered mask
      maskPixels[i] = isForeground ? 255 : 0; // R
      maskPixels[i + 1] = isForeground ? 255 : 0; // G
      maskPixels[i + 2] = isForeground ? 255 : 0; // B
      maskPixels[i + 3] = a; // Keep original alpha
    }

    // Apply Gaussian blur for soft edges
    return applyGaussianBlur(maskData, canvas.width, canvas.height, 3);
  };

  /**
   * Gaussian Blur Filter for Soft Edge Masking
   * Creates smooth, feathered edges around the subject
   */
  const applyGaussianBlur = (
    imageData: ImageData,
    width: number,
    height: number,
    radius: number
  ): ImageData => {
    const kernel = createGaussianKernel(radius);
    const kernelSize = kernel.length;
    const halfSize = Math.floor(kernelSize / 2);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        let weight = 0;

        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - halfSize));
            const py = Math.min(height - 1, Math.max(0, y + ky - halfSize));
            const idx = (py * width + px) * 4;
            const w = kernel[ky] * kernel[kx];

            r += data[idx] * w;
            g += data[idx + 1] * w;
            b += data[idx + 2] * w;
            a += data[idx + 3] * w;
            weight += w;
          }
        }

        const idx = (y * width + x) * 4;
        newData[idx] = Math.round(r / weight);
        newData[idx + 1] = Math.round(g / weight);
        newData[idx + 2] = Math.round(b / weight);
        newData[idx + 3] = Math.round(a / weight);
      }
    }

    return new ImageData(newData, width, height);
  };

  /**
   * Gaussian Kernel Generator
   */
  const createGaussianKernel = (radius: number): number[] => {
    const kernel: number[] = [];
    const size = radius * 2 + 1;
    const sigma = radius / 2;
    let sum = 0;

    for (let i = 0; i < size; i++) {
      const x = i - radius;
      const val = Math.exp(-(x * x) / (2 * sigma * sigma));
      kernel.push(val);
      sum += val;
    }

    return kernel.map((v) => v / sum);
  };

  /**
   * Initialize Mask on Image Load
   * Processes the dancer image and creates the foreground mask
   */
  const initializeMask = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas to image dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Detect foreground subject (dancer)
    const mask = detectForegroundSubject(imageData, canvas);

    // Store mask data
    setMaskData({ canvas, maskImageData: mask });
    setIsLoaded(true);
  };

  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete) {
      initializeMask();
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Hidden Canvas for Mask Processing */}
      <canvas ref={canvasRef} className="hidden" />
      <img
        ref={imageRef}
        src={festivalMask}
        alt="Bhutanese Masked Dancer - Tshechu Festival"
        className="hidden"
        onLoad={initializeMask}
        crossOrigin="anonymous"
      />

      {/* Background Layer with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: heroScale,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={festivalMask}
            alt="Bhutanese Festival Background"
            className="w-full h-full object-cover"
          />
          {/* Darkened Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 via-50% to-black/55" />
        </div>
      </motion.div>

      {/* Premium Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-orange-500/10 via-red-500/5 to-transparent blur-3xl" />
      </div>

      {/* Main Content with Layered Text Masking */}
      <motion.div
        style={{ opacity: heroOpacity, y: textY }}
        className="relative z-20 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white/80 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 drop-shadow-lg"
        >
          Welcome to the Kingdom
        </motion.p>

        {/* Main Headline with Depth Masking */}
        <div className="relative h-32 sm:h-48 md:h-64 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative w-full"
          >
            {/* Foreground Text: "The last" - Stays Visible */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white text-center leading-none">
              The last
            </h1>

            {/* Layered Spacing */}
            <div className="h-2 sm:h-4" />

            {/* Background Text Layer Container with Masking */}
            <div className="relative">
              {/* Depth Shadow Effect */}
              <div className="absolute -inset-4 blur-3xl bg-gradient-to-r from-yellow-600/20 via-orange-600/30 to-red-600/20 opacity-40" />

              {/* "Shangri-La" with Golden-Orange Gradient and Masking */}
              <motion.h2
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic text-center leading-none relative"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #fb923c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: `0 0 30px rgba(249, 115, 22, 0.3)`,
                  filter: "drop-shadow(0 4px 12px rgba(249, 115, 22, 0.25))",
                }}
              >
                Shangri-La
              </motion.h2>

              {/* Depth Blur Overlay Effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-black/5 to-transparent" />
            </div>
          </motion.div>

          {/* 3D Depth Effect Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -bottom-8 sm:-bottom-12 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent w-32 sm:w-48 blur-sm"
          />
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/85 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mt-12 drop-shadow-lg leading-relaxed"
        >
          Experience ancient traditions, sacred festivals, and breathtaking landscapes in the Land of the Thunder Dragon.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10 sm:mt-12"
        >
          <Link to="/packages">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold px-8 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 duration-300"
            >
              Explore Packages
            </Button>
          </Link>
          <Link to="/destinations">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold px-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 duration-300 backdrop-blur-sm"
            >
              Discover Destinations
            </Button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Enhanced CSS for Depth Effects */}
      <style>{`
        @supports (background-clip: text) {
          .cinematic-text {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }

        /* Smooth scrolling and transition optimization */
        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
          }
        }

        /* High-quality text rendering */
        h1, h2, p {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </section>
  );
};

export default CinematicHero;
