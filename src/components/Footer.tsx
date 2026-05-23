import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary border-t border-border">
    <div className="max-w-[980px] mx-auto px-6 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 DrukTrails. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/packages" className="hover:text-foreground transition-colors">Packages</Link>
          <Link to="/destinations" className="hover:text-foreground transition-colors">Destinations</Link>
          <Link to="/companies" className="hover:text-foreground transition-colors">Companies</Link>
          <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
