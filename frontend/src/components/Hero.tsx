import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-glow-pulse" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 hover-glow">
          <Sparkles className="w-4 h-4 text-primary fill-primary" />
          <span className="text-sm font-medium">One-Tap Cross-Rollup Bridge</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 leading-tight">
          Move Your NFT Across Chains.{" "}
          <span className="text-gradient">One Tap. Zero Drama.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          We fix the gas, handle the chains and finish the bridge for you. Just tap.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/bridge">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg hover-glow group">
              Move My NFT
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button size="lg" variant="outline" className="border-border hover:bg-card text-foreground font-semibold px-8 py-6 text-lg">
              How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
