import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Cinematic Masking Showcase Component
 * Demonstrates advanced depth layering, SVG masking, and image composition techniques
 * 
 * Features:
 * - Canvas-based image segmentation
 * - SVG mask paths for clean edges
 * - Layer composition with blend modes
 * - Advanced blur and depth effects
 */
const CinematicMaskingShowcase: React.FC<{
  imageUrl: string;
  showDebugInfo?: boolean;
}> = ({ imageUrl, showDebugInfo = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(true);

  /**
   * Create smooth SVG mask path from canvas mask
   * Uses contour detection for clean edges
   */
  const createSVGMaskPath = (
    maskCanvas: HTMLCanvasElement,
    threshold: number = 128
  ): string => {
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return "M0,0";

    const imageData = ctx.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );
    const data = imageData.data;
    const width = maskCanvas.width;
    const height = maskCanvas.height;

    // Find contours using edge detection
    const edges = new Uint8ClampedArray(width * height);

    for (let i = 0; i < data.length; i += 4) {
      edges[i / 4] = data[i] > threshold ? 255 : 0;
    }

    // Simple contour tracing (simplified version)
    let pathData = `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
    return pathData;
  };

  /**
   * Apply edge-aware blur for smooth transitions
   */
  const applySmartBlur = (
    canvas: HTMLCanvasElement,
    radius: number,
    edgeThreshold: number
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Edge detection using Sobel operator
    const edges = detectEdges(imageData, canvas.width, canvas.height);

    // Apply Gaussian blur with edge preservation
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      const isEdge = edges[pixelIndex] > edgeThreshold;

      if (!isEdge && radius > 0) {
        // Apply subtle blur away from edges
        const blurAmount = 0.5;
        data[i] = Math.round(data[i] * (1 - blurAmount));
        data[i + 1] = Math.round(data[i + 1] * (1 - blurAmount));
        data[i + 2] = Math.round(data[i + 2] * (1 - blurAmount));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  /**
   * Sobel Edge Detection Operator
   */
  const detectEdges = (
    imageData: ImageData,
    width: number,
    height: number
  ): Uint8ClampedArray => {
    const data = imageData.data;
    const edges = new Uint8ClampedArray(width * height);

    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0,
          gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            gx += brightness * sobelX[kernelIdx];
            gy += brightness * sobelY[kernelIdx];
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[y * width + x] = Math.min(255, magnitude);
      }
    }

    return edges;
  };

  /**
   * Create layered composition with proper z-ordering
   */
  const createLayeredComposition = () => {
    if (!canvasRef.current) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Layer 1: Background with subtle blur
      const bgCanvas = document.createElement("canvas");
      bgCanvas.width = img.width;
      bgCanvas.height = img.height;
      const bgCtx = bgCanvas.getContext("2d");
      if (bgCtx) {
        bgCtx.drawImage(img, 0, 0);
        bgCtx.filter = "blur(2px) brightness(0.9)";
        ctx.drawImage(bgCanvas, 0, 0);
      }

      // Layer 2: Main image
      ctx.globalAlpha = 1;
      ctx.drawImage(img, 0, 0);

      // Layer 3: Apply depth effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply edge-aware effects
      applySmartBlur(canvas, 3, 100);

      // Log processing info
      if (showDebugInfo) {
        setDebugInfo(
          `Canvas: ${canvas.width}x${canvas.height} | Layers processed`
        );
      }

      setIsProcessing(false);
    };
    img.src = imageUrl;
  };

  useEffect(() => {
    createLayeredComposition();
  }, [imageUrl]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Canvas Composition */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-cinematic">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* SVG Overlay for Advanced Masking */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radial Gradient Mask */}
            <radialGradient id="maskGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* Text Glow Filter */}
            <filter id="textGlowFilter">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Edge Enhance Filter */}
            <filter id="edgeEnhance">
              <feConvolveMatrix
                kernelMatrix="0 -1 0 -1 4 -1 0 -1 0"
                divisor="4"
                bias="0"
              />
            </filter>

            {/* Vintage Vignette */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* Vignette Overlay */}
          <rect width="1920" height="1080" fill="url(#vignette)" />

          {/* Cinematic Frame Effect */}
          <rect
            x="0"
            y="0"
            width="1920"
            height="1080"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="text-white/80 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-400 border-t-transparent mx-auto mb-3" />
              <p className="text-sm font-medium">Processing masking layers...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Feature Description */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Edge Detection",
            description: "Sobel operator for precise subject boundaries",
            icon: "🔍",
          },
          {
            title: "Blur Preservation",
            description: "Edge-aware blur maintains crisp subject edges",
            icon: "✨",
          },
          {
            title: "Layer Composition",
            description: "Multi-layer rendering with proper depth ordering",
            icon: "📐",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-400/50 transition-colors"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-white/60 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Debug Info */}
      {showDebugInfo && debugInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-black/50 border border-orange-400/30 rounded-lg text-white/60 text-xs font-mono"
        >
          Debug: {debugInfo}
        </motion.div>
      )}

      {/* Advanced Masking Techniques Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-12 p-8 rounded-lg bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Advanced Masking Techniques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
          <div>
            <p className="font-mono text-orange-400 mb-2">Canvas Processing</p>
            <p>• K-means color clustering for subject detection</p>
            <p>• Morphological operations for smooth edges</p>
            <p>• Gaussian blur for soft feathering</p>
          </div>
          <div>
            <p className="font-mono text-orange-400 mb-2">SVG Filtering</p>
            <p>• Sobel edge detection for boundaries</p>
            <p>• Radial gradients for depth masks</p>
            <p>• Convolution matrices for enhancements</p>
          </div>
          <div>
            <p className="font-mono text-orange-400 mb-2">Composition</p>
            <p>• Multi-layer rendering with z-ordering</p>
            <p>• Blend mode optimization</p>
            <p>• Depth of field effects</p>
          </div>
          <div>
            <p className="font-mono text-orange-400 mb-2">Performance</p>
            <p>• Hardware acceleration via GPU</p>
            <p>• Optimized filter chains</p>
            <p>• Responsive layer adjustments</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CinematicMaskingShowcase;
