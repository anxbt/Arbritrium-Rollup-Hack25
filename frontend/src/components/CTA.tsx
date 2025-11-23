import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
          Ready to Build the{" "}
          <span className="text-gradient">Decentralized Future?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of developers building next-generation applications on ChainForge
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg hover-glow group">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-border hover:bg-card text-foreground font-semibold px-8 py-6 text-lg">
            Talk to Sales
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-8">
          No credit card required • Free tier available • Enterprise support
        </p>
      </div>
    </section>
  );
};

export default CTA;
