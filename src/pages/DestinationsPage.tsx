import { Link } from "react-router-dom";
import { destinations } from "@/data/packages";
import { motion } from "framer-motion";
import { MapPin, Package, Star } from "lucide-react";
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

const DestinationsPage = () => {
  return (
    <div className="relative min-h-screen pt-20 pb-24 bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%)]" />
      <div className="pointer-events-none absolute -top-16 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-300/20 via-cyan-200/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-gradient-to-br from-sky-400/15 via-fuchsia-300/10 to-transparent blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm font-medium text-muted-foreground mb-6">
            <MapPin className="w-4 h-4" />
            Explore Bhutan
          </div>
          <h1 className="apple-headline text-5xl md:text-7xl text-foreground mb-4">
            Sacred <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 bg-clip-text text-transparent">Destinations</span>
          </h1>
          <p className="text-muted-foreground text-xl font-light apple-body max-w-2xl mx-auto">
            Discover the mystical valleys and ancient monasteries that make Bhutan the Last Shangri-La.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <Link key={dest.id} to={`/destinations/${dest.id}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_35%)] border border-border shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={destinationImages[dest.id] || paroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Package Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Package className="w-3 h-3 text-foreground" />
                    <span className="text-xs font-semibold text-foreground">{dest.packageCount}</span>
                  </div>

                  {/* Featured Badge for popular destinations */}
                  {dest.packageCount > 3 && (
                    <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold-foreground fill-current" />
                      <span className="text-xs font-semibold text-gold-foreground">Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="apple-subhead text-xl font-semibold text-foreground mb-1 group-hover:text-gold transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">{dest.subtitle}</p>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Highlights Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.highlights.slice(0, 2).map((highlight) => (
                      <span
                        key={highlight}
                        className="px-2 py-1 bg-secondary/50 text-xs text-muted-foreground rounded-md"
                      >
                        {highlight}
                      </span>
                    ))}
                    {dest.highlights.length > 2 && (
                      <span className="px-2 py-1 bg-secondary/50 text-xs text-muted-foreground rounded-md">
                        +{dest.highlights.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground font-medium group-hover:text-gold transition-colors">
                      Explore Destination →
                    </span>
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <MapPin className="w-4 h-4 text-foreground group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="apple-headline text-3xl md:text-4xl text-foreground mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Choose from our curated packages or contact us for a custom Bhutan experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition-colors"
              >
                View All Packages
              </Link>
              <Link
                to="/companies"
                className="inline-flex items-center justify-center px-8 py-3 border border-border rounded-full font-semibold hover:bg-secondary transition-colors"
              >
                Find Tour Operators
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationsPage;
