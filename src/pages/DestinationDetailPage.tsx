import { useParams, Link } from "react-router-dom";
import { destinations } from "@/data/packages";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import bumthangImage from "@/assets/bumthang.webp";
import paroImage from "@/assets/paro.jpg";
import phobijaImage from "@/assets/phobija.avif";
import punakhaImage from "@/assets/punakha.jpg";
import thimphuImage from "@/assets/thimphu.png";
import haaImage from "@/assets/haa.jpg";

const destinationImages: Record<string, string> = {
  paro: paroImage,
  thimphu: thimphuImage,
  punakha: punakhaImage,
  bumthang: bumthangImage,
  phobjikha: phobijaImage,
  haa: haaImage,
};

const DestinationDetailPage = () => {
  const { id } = useParams();
  const destination = destinations.find((item) => item.id === id);

  if (!destination) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center px-6 py-10 rounded-3xl border border-border bg-background shadow-sm">
          <h1 className="apple-headline text-2xl mb-4">Destination not found</h1>
          <Link to="/destinations" className="text-sm text-primary-foreground hover:text-foreground transition-colors">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        <Link to="/destinations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8 mb-8">
          <ArrowLeft className="w-4 h-4" /> Destinations
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
          <div className="rounded-3xl overflow-hidden aspect-[4/3]">
            <img
              src={destinationImages[destination.id] || paroImage}
              alt={destination.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.25em]">{destination.packageCount} packages available</p>
            <h1 className="apple-headline text-4xl md:text-5xl text-foreground">{destination.name}</h1>
            <p className="text-muted-foreground text-lg max-w-3xl">{destination.subtitle}</p>
            <p className="text-foreground text-base leading-8 max-w-3xl">{destination.details}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {destination.highlights.map((highlight) => (
              <div key={highlight} className="rounded-3xl border border-border bg-background p-6">
                <p className="text-sm font-semibold text-foreground mb-2">Highlight</p>
                <p className="text-sm text-muted-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
