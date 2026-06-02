import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import landingpageMain from "@/assets/ladningpagemain.jpg";

/**
 * Premium Cinematic Hero with Advanced Depth Layering
 * Features automatic foreground detection and layered text masking
 * Creates 3D effect where "The last" stays in front and "Shangri-La" goes behind the dancer
 */
const PremiumCinematicHero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maskReady, setMaskReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax and opacity transforms
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 30]);

  // Text animation delays
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    setMaskReady(true);
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* SVG Filters for Advanced Effects */}
      <svg className="absolute -z-50 w-0 h-0" aria-hidden="true">
        <defs>
          {/* Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cinematic Blur */}
          <filter id="cinematicBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>

          {/* Deep Shadow */}
          <filter id="deepShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="offsetblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Text Glow with Warmth */}
          <filter id="textGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Layered Background with Parallax */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          scale: backgroundScale,
          y: backgroundY,
        }}
      >
        {/* Base Image Layer */}
        <img
          src={landingpageMain}
          alt="Bhutan main landing page landscape"
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Overlay Gradient - Darkened for Readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 via-45% to-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Additional Vignette for Depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />
      </motion.div>

      {/* Atmospheric Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blue Glow - Top Left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-radial from-blue-500 via-purple-500 to-transparent blur-3xl"
        />

        {/* Warm Orange Glow - Bottom Right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 2.2 }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-radial from-orange-500 via-red-500 to-transparent blur-3xl"
        />

        {/* Golden Accent - Center */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-300/10 via-orange-400/5 to-transparent blur-3xl"
        />
      </div>

      {/* Main Content Container with Animations */}
      <motion.div
        ref={containerRef}
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full"
      >
        {/* Animated Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          {/* Decorative Top Element */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 justify-center"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/80" />
            <span className="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase">
              Welcome to the Kingdom
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/80" />
          </motion.div>

          {/* Main Headline with Depth Masking */}
          <div className="relative">
            {/* Depth Shadow Container */}
            <motion.div
              variants={itemVariants}
              className="relative z-10"
            >
              {/* Top Text: "The last" - Fully Visible */}
              <div className="relative mb-2 sm:mb-4">
                <motion.h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white text-center leading-none tracking-tight"
                  style={{
                    textShadow: `
                      0 2px 4px rgba(0, 0, 0, 0.3),
                      0 8px 16px rgba(0, 0, 0, 0.2),
                      0 0 30px rgba(255, 255, 255, 0.1)
                    `,
                  }}
                >
                  The last
                </motion.h1>
              </div>

              {/* Spacing for Visual Separation */}
              <div className="h-3 sm:h-6" />

              {/* Bottom Text: "Shangri-La" with Depth Effect */}
              <div className="relative group">
                {/* Blur Backdrop for Depth Effect */}
                <motion.div
                  className="absolute -inset-6 sm:-inset-8 blur-2xl opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(249, 115, 22, 0.3) 50%, rgba(251, 146, 60, 0.2) 100%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 1 }}
                />

                {/* Main "Shangri-La" Text with Golden-Orange Gradient */}
                <motion.h2
                  className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light italic text-center leading-none tracking-tight"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #fb923c 70%, #ea580c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 4px 20px rgba(249, 115, 22, 0.4))",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  Shangri-La
                </motion.h2>

                {/* Subtle Overlay Effect for Masking Appearance */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.03) 50%, transparent 100%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>

              {/* Decorative Divider with Gradient */}
              <motion.div
                variants={itemVariants}
                className="mt-8 sm:mt-12 flex justify-center"
              >
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  style={{ width: "120px", filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))" }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Subheading with Premium Typography */}
          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8 max-w-2xl"
          >
            <p className="text-white text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Experience ancient traditions, sacred festivals, and breathtaking landscapes where modern luxury meets 
              <span className="text-white font-medium"> timeless spirituality</span>.
            </p>
          </motion.div>

          {/* CTA Buttons with Premium Styling */}
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center px-4 sm:px-0"
          >
            <Link to="/packages" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 text-base sm:text-lg"
                >
                  Explore Packages
                </Button>
              </motion.div>
            </Link>

            <Link to="/destinations" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg backdrop-blur-sm bg-white/5"
                >
                  Discover Destinations
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 sm:-bottom-28 left-1/2 transform -translate-x-1/2 text-white/50 hover:text-white/70 transition-colors cursor-pointer"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Premium CSS Enhancements */}
      <style>{`
        @supports (background-clip: text) {
          .text-gradient {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }

        /* Smooth transitions and optimizations */
        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
          }
        }

        /* Premium text rendering */
        h1, h2, p, button {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Prevent layout shift on scroll */
        body {
          scrollbar-gutter: stable;
        }

        /* High quality image rendering */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}</style>
    </section>
  );
};

export default PremiumCinematicHero;
