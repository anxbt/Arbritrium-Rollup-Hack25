import { Zap, Shield, Network, Code2, Wallet, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process 50,000+ transactions per second with sub-second finality",
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "Advanced cryptographic protocols and multi-layer security architecture",
  },
  {
    icon: Network,
    title: "Cross-Chain Compatible",
    description: "Seamlessly bridge assets and data across multiple blockchain networks",
  },
  {
    icon: Code2,
    title: "Developer-First",
    description: "Comprehensive SDKs, APIs, and tools for rapid dApp development",
  },
  {
    icon: Wallet,
    title: "Low Transaction Costs",
    description: "Optimized gas fees that scale with your application's growth",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    description: "Launch your Web3 project in minutes with our streamlined workflow",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            Engineered for <span className="text-gradient">Performance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade infrastructure that scales with your vision
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border p-8 hover:border-primary/50 transition-all duration-300 hover-glow group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary fill-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
