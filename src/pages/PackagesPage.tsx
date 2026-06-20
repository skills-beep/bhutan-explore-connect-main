import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { packages } from "@/data/packages";
import PackageCard from "@/components/PackageCard";
import { useScrollReveal } from "@/hooks/use-motion";
import { Search, X } from "lucide-react";

const styles = ["All", "Cultural", "Luxury", "Adventure"];

const PackagesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const searchRevealRef = useScrollReveal({ y: 25, duration: 0.75 });
  const gridRevealRef = useScrollReveal({ y: 30, duration: 0.8, delay: 0.05 });

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      if (search && !pkg.title.toLowerCase().includes(search.toLowerCase()) && !pkg.destination.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedStyle !== "All" && pkg.style !== selectedStyle) return false;
      return true;
    });
  }, [search, selectedStyle]);

  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-background shadow-soft"
        >
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/20 via-transparent to-[hsl(var(--forest))]/10" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-gold opacity-20 blur-2xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-forest opacity-15 blur-2xl" />

          <div className="relative p-10 md:p-12">
            <div className="text-center">
              <h1 className="apple-headline text-4xl md:text-6xl text-foreground mb-3">
                Travel Packages
              </h1>
              <p className="text-muted-foreground text-lg font-light apple-body">
                Curated Bhutan experiences from trusted operators.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div ref={searchRevealRef} className="mt-10 mb-10 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages..."
              className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-background text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-foreground/10 outline-none transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex justify-center gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStyle(s)}
                className={`px-4 py-1.5 text-xs rounded-full transition-all ${
                  selectedStyle === s
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRevealRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-lg py-20">No packages found.</p>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
