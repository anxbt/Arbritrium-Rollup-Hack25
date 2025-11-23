import { Card } from "@/components/ui/card";
import { Hand, Zap, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Hand,
    title: "Pick NFT",
    description: "Choose the NFT you want to move from your L3 wallet",
  },
  {
    icon: Zap,
    title: "Tap Move",
    description: "One tap to start the bridge—no gas worries, no chain switching",
  },
  {
    icon: CheckCircle,
    title: "We Handle Everything",
    description: "Our relayer fixes gas, bridges your NFT, and lands it safely on L2",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps. No complicated workflows. No technical headaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-card border-border p-8 text-center hover:border-primary/50 transition-all duration-300 hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <step.icon className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
              </div>
              <div className="text-4xl font-heading font-bold text-gradient mb-3">
                {index + 1}
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h3 className="text-2xl font-heading font-bold mb-4 text-center">
            The Magic Behind the Scenes
          </h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Our backend relayer automatically detects missing gas on your L3 wallet, 
            tops it up, and completes the bridge transaction—all in one seamless flow. 
            You just tap once and wait for your NFT to arrive on L2. That's it.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
