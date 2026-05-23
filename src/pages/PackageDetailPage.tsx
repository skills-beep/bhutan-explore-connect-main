import { useParams, Link } from "react-router-dom";
import { packages } from "@/data/packages";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Check, X, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

import festivalMask1 from "@/assets/festival-mask-1.png";
import festivalMask2 from "@/assets/festival-mask-2.png";
import festivalMask3 from "@/assets/festival-mask-3.png";
import festivalMask4 from "@/assets/festival-mask-4.png";

const allImages = [festivalMask1, festivalMask2, festivalMask3, festivalMask4, festivalMask1, festivalMask2];

const PackageDetailPage = () => {
  const { id } = useParams();
  const pkg = packages.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", dates: "", travelers: "2", message: "" });

  if (!pkg) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="apple-headline text-2xl mb-4">Package not found</h1>
          <Link to="/packages"><Button>Back to Packages</Button></Link>
        </div>
      </div>
    );
  }

  const pkgImages = [
    allImages[parseInt(pkg.id) - 1] || allImages[0],
    allImages[(parseInt(pkg.id)) % allImages.length],
    allImages[(parseInt(pkg.id) + 1) % allImages.length],
  ];

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inquiry sent! The tour operator will contact you shortly.");
    setInquiry({ name: "", email: "", phone: "", dates: "", travelers: "2", message: "" });
  };

  const inputClass = "w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground/10 transition-all";

  return (
    <div className="min-h-screen pt-16 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        <Link to="/packages" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8 mb-8">
          <ArrowLeft className="w-4 h-4" /> Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-3">
                <img src={pkgImages[selectedImage]} alt={pkg.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                {pkgImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-14 rounded-xl overflow-hidden transition-all ${selectedImage === i ? "ring-2 ring-foreground" : "opacity-50 hover:opacity-80"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">{pkg.company}</p>
              <h1 className="apple-headline text-3xl md:text-4xl text-foreground mb-4">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {pkg.destination}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-foreground text-foreground" /> {pkg.rating}</span>
                <span className="bg-secondary px-3 py-1 rounded-full text-xs">{pkg.style}</span>
              </div>
              <p className="text-muted-foreground apple-body">{pkg.description}</p>
            </div>

            <div>
              <h2 className="apple-subhead text-xl mb-4">Highlights</h2>
              <div className="grid grid-cols-2 gap-2">
                {pkg.highlights.map((h) => (
                  <p key={h} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" />{h}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="apple-subhead text-xl mb-6">Itinerary</h2>
              <div className="space-y-6">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">{day.day}</span>
                      {day.day < pkg.itinerary.length && <div className="w-px flex-1 bg-border mt-2" />}
                    </div>
                    <div className="pb-2">
                      <h3 className="text-sm font-semibold text-foreground">{day.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Included</h3>
                {pkg.inclusions.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                    <Check className="w-3.5 h-3.5 text-forest" />{item}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Not Included</h3>
                {pkg.exclusions.map((item) => (
                  <p key={item} className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                    <X className="w-3.5 h-3.5 text-destructive" />{item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-3xl border border-border bg-background p-6">
              <div className="mb-5">
                <span className="apple-headline text-3xl text-foreground">${pkg.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm ml-1">per person</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">All-inclusive with SDF, accommodation, meals, and guide.</p>

              <form onSubmit={handleInquiry} className="space-y-3">
                <p className="text-sm font-semibold text-foreground mb-1">Send Inquiry</p>
                <input type="text" required placeholder="Name" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className={inputClass} />
                <input type="email" required placeholder="Email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} className={inputClass} />
                <input type="text" placeholder="Travel Dates" value={inquiry.dates} onChange={(e) => setInquiry({ ...inquiry, dates: e.target.value })} className={inputClass} />
                <input type="number" min="1" placeholder="Travelers" value={inquiry.travelers} onChange={(e) => setInquiry({ ...inquiry, travelers: e.target.value })} className={inputClass} />
                <textarea placeholder="Message..." value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} className={`${inputClass} h-20 resize-none`} />
                <Button type="submit" variant="apple" className="w-full" size="lg">
                  <Send className="w-4 h-4" /> Send Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
