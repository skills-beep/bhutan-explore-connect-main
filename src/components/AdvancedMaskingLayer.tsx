import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MaskLayer {
  foreground: CanvasImageSource;
  background: CanvasImageSource;
  mask: CanvasImageSource;
}

/**
 * Advanced Masking Layer Component
 * Handles multi-layer masking and depth composition for cinematic effect
 */
const AdvancedMaskingLayer: React.FC<{
  imageUrl: string;
  onMaskReady?: (maskData: MaskLayer) => void;
}> = ({ imageUrl, onMaskReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Enhanced Foreground Detection using K-means clustering
   * More sophisticated separation of dancer from background
   */
  const enhancedForegroundDetection = (
    imageData: ImageData,
    width: number,
    height: number
  ): Uint8ClampedArray => {
    const data = imageData.data;
    const mask = new Uint8ClampedArray(width * height);

    // Sample colors to build histogram
    const colorSamples: Array<{ r: number; g: number; b: number }> = [];
    const sampleRate = 4;

    for (let i = 0; i < data.length; i += 4 * sampleRate) {
      colorSamples.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      });
    }

    // Find dominant colors (costume colors)
    const dominantColors = extractDominantColors(colorSamples, 3);

    // Classify pixels based on similarity to dominant colors
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const pixelIndex = i / 4;

      // Find closest dominant color
      const closestColor = dominantColors.reduce((closest, current) => {
        const currentDist = colorDistance(
          { r, g, b },
          current
        );
        const closestDist = colorDistance(
          { r, g, b },
          closest
        );
        return currentDist < closestDist ? current : closest;
      });

      const dist = colorDistance({ r, g, b }, closestColor);

      // If color is within threshold of dominant colors, mark as foreground
      if (dist < 80) {
        mask[pixelIndex] = 255;
      } else {
        mask[pixelIndex] = 0;
      }
    }

    // Apply morphological operations for smoothing
    return morphologicalClose(mask, width, height, 3);
  };

  /**
   * Extract dominant colors using simple clustering
   */
  const extractDominantColors = (
    colors: Array<{ r: number; g: number; b: number }>,
    k: number
  ) => {
    if (colors.length === 0) return [];

    const centroids: Array<{ r: number; g: number; b: number }> = [];
    for (let i = 0; i < k && i < colors.length; i++) {
      centroids.push(colors[Math.floor((i * colors.length) / k)]);
    }

    // K-means iterations
    for (let iter = 0; iter < 5; iter++) {
      const clusters: Array<Array<{ r: number; g: number; b: number }>> = centroids.map(() => []);

      colors.forEach((color) => {
        const closest = centroids.reduce((c, current, idx) => {
          return colorDistance(color, current) <
            colorDistance(color, centroids[c])
            ? idx
            : c;
        }, 0);
        clusters[closest].push(color);
      });

      centroids.forEach((centroid, idx) => {
        if (clusters[idx].length > 0) {
          const sum = clusters[idx].reduce(
            (acc, c) => ({
              r: acc.r + c.r,
              g: acc.g + c.g,
              b: acc.b + c.b,
            }),
            { r: 0, g: 0, b: 0 }
          );
          centroid.r = Math.round(sum.r / clusters[idx].length);
          centroid.g = Math.round(sum.g / clusters[idx].length);
          centroid.b = Math.round(sum.b / clusters[idx].length);
        }
      });
    }

    return centroids;
  };

  /**
   * Calculate color distance in RGB space
   */
  const colorDistance = (
    c1: { r: number; g: number; b: number },
    c2: { r: number; g: number; b: number }
  ) => {
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  /**
   * Morphological Close Operation (Dilation followed by Erosion)
   * Fills small holes and smooths edges
   */
  const morphologicalClose = (
    mask: Uint8ClampedArray,
    width: number,
    height: number,
    radius: number
  ): Uint8ClampedArray => {
    // Dilation
    let result = mask.slice();
    for (let r = 0; r < radius; r++) {
      result = dilate(result, width, height);
    }
    // Erosion
    for (let r = 0; r < radius; r++) {
      result = erode(result, width, height);
    }
    return result;
  };

  /**
   * Dilation Operation
   */
  const dilate = (
    mask: Uint8ClampedArray,
    width: number,
    height: number
  ): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(mask.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let max = mask[idx];
        // Check neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              max = Math.max(max, mask[ny * width + nx]);
            }
          }
        }
        result[idx] = max;
      }
    }
    return result;
  };

  /**
   * Erosion Operation
   */
  const erode = (
    mask: Uint8ClampedArray,
    width: number,
    height: number
  ): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(mask.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let min = mask[idx];
        // Check neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              min = Math.min(min, mask[ny * width + nx]);
            }
          }
        }
        result[idx] = min;
      }
    }
    return result;
  };

  /**
   * Create gradient blur for soft feathering
   */
  const featherMask = (
    mask: Uint8ClampedArray,
    width: number,
    height: number,
    featherRadius: number
  ): Uint8ClampedArray => {
    const feathered = new Uint8ClampedArray(mask.length);
    const kernel: number[] = [];
    const size = featherRadius * 2 + 1;

    // Create Gaussian kernel
    for (let i = 0; i < size; i++) {
      const x = i - featherRadius;
      const val = Math.exp(-(x * x) / (2 * featherRadius * featherRadius));
      kernel.push(val);
    }
    const sum = kernel.reduce((a, b) => a + b, 0);
    kernel.forEach((_, i) => (kernel[i] /= sum));

    // Apply blur
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let value = 0;
        let weight = 0;

        for (let ky = 0; ky < size; ky++) {
          for (let kx = 0; kx < size; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - featherRadius));
            const py = Math.min(height - 1, Math.max(0, y + ky - featherRadius));
            const pidx = py * width + px;
            const w = kernel[ky] * kernel[kx];
            value += mask[pidx] * w;
            weight += w;
          }
        }

        feathered[idx] = Math.round(value / weight);
      }
    }

    return feathered;
  };

  /**
   * Process image and create mask layers
   */
  const processImage = async () => {
    if (!canvasRef.current || !imageRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw original image
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Create foreground mask
    const maskPixels = enhancedForegroundDetection(
      imageData,
      canvas.width,
      canvas.height
    );

    // Feather edges for smooth blending
    const featheredMask = featherMask(
      maskPixels,
      canvas.width,
      canvas.height,
      8
    );

    // Create mask image
    const maskImageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < featheredMask.length; i++) {
      maskImageData.data[i * 4] = featheredMask[i];
      maskImageData.data[i * 4 + 1] = featheredMask[i];
      maskImageData.data[i * 4 + 2] = featheredMask[i];
      maskImageData.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(maskImageData, 0, 0);

    // Create separate layers
    const foregroundCanvas = document.createElement("canvas");
    foregroundCanvas.width = canvas.width;
    foregroundCanvas.height = canvas.height;
    const fgCtx = foregroundCanvas.getContext("2d");
    if (!fgCtx) return;

    // Composite foreground
    fgCtx.drawImage(img, 0, 0);
    fgCtx.globalCompositeOperation = "destination-in";
    fgCtx.drawImage(canvas, 0, 0);

    const backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.width = canvas.width;
    backgroundCanvas.height = canvas.height;
    const bgCtx = backgroundCanvas.getContext("2d");
    if (!bgCtx) return;

    // Composite background
    bgCtx.drawImage(img, 0, 0);
    bgCtx.globalCompositeOperation = "destination-out";
    bgCtx.drawImage(canvas, 0, 0);

    onMaskReady?.({
      foreground: foregroundCanvas,
      background: backgroundCanvas,
      mask: canvas,
    });

    setIsProcessing(false);
  };

  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete) {
      processImage();
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Processing"
        className="hidden"
        onLoad={processImage}
        crossOrigin="anonymous"
      />
    </>
  );
};

export default AdvancedMaskingLayer;
