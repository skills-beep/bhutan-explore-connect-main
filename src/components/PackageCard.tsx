import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { TravelPackage } from "@/data/packages";
import { motion } from "framer-motion";

import festivalMask1 from "@/assets/festival-mask-1.png";
import festivalMask2 from "@/assets/festival-mask-2.png";
import festivalMask3 from "@/assets/festival-mask-3.png";
import festivalMask4 from "@/assets/festival-mask-4.png";

const images = [festivalMask1, festivalMask2, festivalMask3, festivalMask4, festivalMask1, festivalMask2];

interface PackageCardProps {
  pkg: TravelPackage;
  index?: number;
}

const PackageCard = ({ pkg, index = 0 }: PackageCardProps) => {
  return (
    <motion.div
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
