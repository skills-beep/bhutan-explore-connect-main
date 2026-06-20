import { ArrowRight, Star } from "lucide-react";
import type React from "react";

import { Link } from "react-router-dom";
import { TravelPackage } from "@/data/packages";
import { motion } from "framer-motion";
import { useHoverScale } from "@/hooks/use-motion";

// Unique tour-related images for each package - all different and non-repeating
const images = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop", // Classic Western Tour
  "https://images.unsplash.com/photo-1552520514-5fefe8c9ef14?w=800&h=600&fit=crop", // Luxury Wellness
  "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop", // Druk Path Trek
  "https://images.unsplash.com/photo-1530281700549-e82e7da489c7?w=800&h=600&fit=crop", // Cultural Tour
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", // Eastern Explorer
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop", // Festival Special
];

interface PackageCardProps {
  pkg: TravelPackage;
  index?: number;
}

const PackageCard = ({ pkg, index = 0 }: PackageCardProps) => {
  const hoverRef = useHoverScale(1.02);

  return (
    <motion.div
      ref={hoverRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 40 }}

      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/packages/${pkg.id}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl bg-background transition-all duration-500 hover:shadow-elevated border border-border/60 group-hover:border-border/80">
          {/* subtle gradient border/glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-[hsl(var(--gold))]/20 via-transparent to-transparent" />

            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={images[parseInt(pkg.id) - 1] || images[0]}
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-900 ease-out"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[11px] text-white/90">
                  {pkg.style}
                </span>
                <span className="inline-flex items-center rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[11px] text-white/90">
                  {pkg.duration}
                </span>
              </div>

              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[11px] text-white/90 leading-none">
                  <Star className="w-3 h-3 fill-foreground text-gold flex-none" />
                  <span className="font-medium">{pkg.rating}</span>
                  <span className="text-white/70">({pkg.reviewCount})</span>
                </span>
              </div>
            </div>

          <div className="p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{pkg.company}</p>
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-1.5 group-hover:text-muted-foreground transition-colors">
                    {pkg.title}
                  </h3>
                </div>

                <div className="shrink-0">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-secondary/60 border border-border/70 text-foreground transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:bg-secondary">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 apple-body">
                {pkg.shortDescription}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-foreground tracking-tight">
                  From ${pkg.price.toLocaleString()}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 border border-border/60 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  View details
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
