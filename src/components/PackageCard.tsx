import { Star } from "lucide-react";
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
      ref={hoverRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/packages/${pkg.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl bg-background transition-all duration-500 hover:shadow-elevated">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={images[parseInt(pkg.id) - 1] || images[0]}
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>
          <div className="p-5">
            <p className="text-xs text-muted-foreground mb-1">{pkg.company}</p>
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-1.5 group-hover:text-muted-foreground transition-colors">
              {pkg.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 apple-body">{pkg.shortDescription}</p>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground tracking-tight">
                From ${pkg.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-foreground text-foreground" />
                <span>{pkg.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
