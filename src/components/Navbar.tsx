import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import logoImage from "@/assets/logo2.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/destinations", label: "Destinations" },
  { to: "/bhutan-connects", label: "Connect" },
  { to: "/messages", label: "Messages" },
  { to: "/companies", label: "Companies" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = scrolled || !isHome
    ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
    : "bg-transparent";

  const textColor = !scrolled && isHome ? "text-primary-foreground" : "text-foreground";
  const mutedColor = !scrolled && isHome ? "text-primary-foreground/60" : "text-muted-foreground";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className={`flex items-center gap-3 ${textColor}`}>
            <img src={logoImage} alt="Bhutan Explore Connect logo" className="h-8 w-auto object-contain" />
            <span className="text-lg font-semibold tracking-tight">Bhutan<span className="font-light">Explore</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs transition-colors ${
                  location.pathname === link.to ? textColor : mutedColor
                } hover:${textColor}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${mutedColor} hover:${textColor}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link to="/profile" className={`text-xs ${mutedColor} hover:${textColor} transition-colors`}>
              Profile
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden ${textColor}`}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm text-foreground">
                  {link.label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-foreground">
                Profile
              </Link>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Toggle Theme
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
