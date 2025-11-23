import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-heading font-bold text-primary-foreground">
            CF
          </div>
          <span className="text-xl font-heading font-bold">ChainForge</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
            How It Works
          </Link>
          <Link to="/faq" className="text-foreground hover:text-primary transition-colors font-medium">
            FAQ
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
            About
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/bridge">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Bridge Now
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
