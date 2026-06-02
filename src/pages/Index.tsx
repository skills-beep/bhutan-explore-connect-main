import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGlow, useParallax, useScrollReveal } from "@/hooks/use-motion";
import festivalMask1 from "@/assets/festival-mask-1.png";
import festivalMask2 from "@/assets/festival-mask-2.png";
import festivalMask3 from "@/assets/festival-mask-3.png";
import festivalMask4 from "@/assets/festival-mask-4.png";
import bumthangImage from "@/assets/bumthang.webp";
import landingpage1 from "@/assets/landingpage1.jpg";
import landingpage2 from "@/assets/landingpage2.jpg";
import landingpage3 from "@/assets/landingpage3.jpg";
import landingpageMain from "@/assets/ladningpagemain.jpg";
import paroImage from "@/assets/paro.jpg";
import phobijaImage from "@/assets/phobija.avif";
import punakhaImage from "@/assets/punakha.jpg";
import thimphuImage from "@/assets/thimphu.png";
import haaImage from "@/assets/haa.jpg";
import bhutanImage from "@/assets/bhutan.avif";
import { packages, destinations } from "@/data/packages";
import PackageCard from "@/components/PackageCard";
import PremiumCinematicHero from "@/components/PremiumCinematicHero";

const destinationImages: Record<string, string> = {
  paro: paroImage,
  thimphu: thimphuImage,
  punakha: punakhaImage,
  bumthang: bumthangImage,
  phobjikha: phobijaImage,
  haa: haaImage,
};

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`py-24 md:py-32 ${className}`}>
    <div className="max-w-[980px] mx-auto px-6">{children}</div>
  </section>
);

const Index = () => {
  const featuredPackages = packages.slice(0, 3);
  const introRevealRef = useScrollReveal({ y: 30, duration: 0.85 });
  const ctaRevealRef = useScrollReveal({ y: 30, duration: 0.85, delay: 0.1 });
  const destinationsRevealRef = useScrollReveal({ y: 30, duration: 0.85 });
  const festivalRevealRef = useScrollReveal({ y: 30, duration: 0.85 });
  const heroImageRef = useParallax(0.16);
  const buttonGlowRef = useGlow();

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Cinematic Hero with Layered Depth Masking */}
      <PremiumCinematicHero />

      {/* Full-bleed mask strip — cinematic image band */}
      <section className="bg-foreground">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[40vh] md:h-[50vh]">
          {[landingpage1, landingpage2, landingpage3].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <img src={img} alt={`Landing page ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            </motion.div>
          ))}
        </div>
        <div className="max-w-[980px] mx-auto px-6 py-12 text-center">
          <p className="text-primary-foreground/50 text-xs tracking-widest uppercase">
            Tshechu Festival — Sacred masked dances performed across Bhutan's ancient monasteries
          </p>
        </div>
      </section>

      {/* About Bhutan Section with Image */}
      <Section className="bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            ref={heroImageRef}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden"
          >
            <img
              src={bhutanImage}
              alt="Beautiful landscape of Bhutan with mountains and valleys"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            ref={introRevealRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary/60 text-sm font-medium tracking-widest uppercase mb-4">
              Discover the Land
            </p>
            <h2 className="apple-headline text-4xl md:text-5xl text-foreground mb-6">
              Welcome to Bhutan
            </h2>
            <div className="space-y-5 text-muted-foreground text-lg font-light apple-body leading-relaxed">
              <p>
                Nestled high in the Eastern Himalayas, Bhutan is a nation unlike any other. While the world measures progress by GDP, Bhutan measures it by <span className="text-foreground font-semibold">Gross National Happiness</span> — a philosophy that prioritizes well-being over material wealth.
              </p>
              <p>
                This pristine kingdom is a sanctuary of unspoiled beauty, where <span className="text-foreground font-semibold">70% of the land remains forested</span> and carbon emissions are entirely offset by vast tracts of protected wilderness. Bhutan is the world's only <span className="text-foreground font-semibold">carbon-negative country</span>, a distinction it guards with pride and purpose.
              </p>
              <p>
                Ancient Buddhist traditions have flourished here for over 1,200 years, creating a living culture where sacred monasteries perch on cliff faces, traditional architecture graces every village, and festivals celebrate age-old rituals that connect communities to their spiritual heritage.
              </p>
              <p>
                Come experience a place where nature thrives, spirituality runs deep, and happiness is not a distant goal but a way of life. This is Bhutan — the Last Shangri-La.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link to="/destinations">
                <Button variant="apple" size="lg">Explore Destinations</Button>
              </Link>
              <Link to="/packages">
                <Button variant="outline" size="lg">View Packages</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Intro Text */}
      <Section className="bg-background">
        <div ref={destinationsRevealRef} className="text-center">
          <h2 className="apple-headline text-3xl md:text-5xl lg:text-[56px] text-foreground mb-6">
            A kingdom that measures<br />
            <span className="text-muted-foreground">Gross National Happiness.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto apple-body">
            Bhutan is the world's only carbon-negative country, where 70% of the land is pristine forest and ancient Buddhist traditions have thrived for over 1,200 years.
          </p>
        </div>
      </Section>

      {/* Bhutan Connects CTA */}
      <Section className="bg-primary/5">
        <motion.div
          ref={ctaRevealRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="apple-headline text-3xl md:text-5xl text-foreground mb-6">
            Connect with Bhutan
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 apple-body">
            Find a local host for authentic hospitality or connect with fellow travelers to share your Bhutan journey.
          </p>
          <div ref={buttonGlowRef} className="inline-flex rounded-full p-1 bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/20">
            <Link to="/bhutan-connects">
              <Button variant="apple" size="lg" className="px-8 bg-background/95">
                Find a Couch or Travel Buddy in Bhutan
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* Featured Packages */}
      <Section className="bg-secondary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm font-medium mb-2">Curated for you</p>
          <h2 className="apple-headline text-3xl md:text-5xl text-foreground">Popular Packages</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredPackages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/packages">
            <Button variant="appleText" size="sm">View all packages →</Button>
          </Link>
        </motion.div>
      </Section>

      {/* Destinations */}
      <Section className="bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm font-medium mb-2">Where to go</p>
          <h2 className="apple-headline text-3xl md:text-5xl text-foreground">Explore Bhutan</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group relative rounded-3xl overflow-hidden aspect-[16/10] cursor-pointer"
            >
              <img
                src={destinationImages[dest.id] || festivalMask1}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="apple-subhead text-2xl text-primary-foreground mb-1">{dest.name}</h3>
                <p className="text-primary-foreground/70 text-sm font-light">{dest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Festivals — Big cinematic showcase */}
      <section className="bg-foreground py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-6">
          <div ref={festivalRevealRef} className="text-center mb-16">
            <p className="text-primary-foreground/50 text-sm font-medium mb-2">Living traditions</p>
            <h2 className="apple-headline text-3xl md:text-5xl text-primary-foreground mb-4">
              Sacred Festivals
            </h2>
            <p className="text-primary-foreground/60 text-lg font-light max-w-xl mx-auto apple-body">
              Centuries-old masked dances performed during Tshechu celebrations across Bhutan's ancient monasteries.
            </p>
          </div>

          {/* Large feature image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden aspect-[16/9] mb-5"
          >
            <img src={festivalMask4} alt="Cham Dance performer" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>

          {/* Three smaller images */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { img: festivalMask2, title: "Ging Tsholing — Fierce protective deity" },
              { img: festivalMask3, title: "Shinje Yab Yum — Lord of Death" },
              { img: festivalMask1, title: "Atsara — The sacred clown" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="group relative rounded-2xl overflow-hidden aspect-square"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <p className="text-primary-foreground text-xs font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <Section className="bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="apple-headline text-3xl md:text-5xl text-foreground">
            Trusted by travelers<br />
            <span className="text-muted-foreground">worldwide.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah Chen", from: "Singapore", text: "An absolutely magical experience. The Tiger's Nest hike was life-changing." },
            { name: "James Miller", from: "London", text: "DrukTrails made planning so easy. The whole trip exceeded expectations." },
            { name: "Priya Sharma", from: "Mumbai", text: "The festival tour was incredible — we felt welcomed into a living culture." },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-foreground text-base leading-relaxed mb-4 apple-body">"{t.text}"</p>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.from}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA — Cinematic mask close-up */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img src={festivalMask3} alt="Bhutan sacred mask close-up" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 to-foreground/80" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h2 className="apple-headline text-3xl md:text-5xl lg:text-[56px] text-primary-foreground mb-4">
            Your journey begins here.
          </h2>
          <p className="text-primary-foreground/70 text-lg font-light max-w-md mx-auto mb-8">
            Discover the Land of the Thunder Dragon.
          </p>
          <Link to="/packages">
            <Button variant="apple" size="lg">Get Started</Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
