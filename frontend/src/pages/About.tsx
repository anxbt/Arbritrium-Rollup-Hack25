import { Card } from "@/components/ui/card";
import { Lightbulb, Target, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            About the <span className="text-gradient">Project</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Built for humans, judged by hackers
          </p>
        </div>

        <Card className="p-8 bg-card border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary fill-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold mb-3">The Problem</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bridging NFTs between chains is painful. Users deal with gas fees, chain switching, 
                multiple approvals, and confusing workflows. It's technical, slow, and frustrating—especially 
                for non-crypto natives who just want to move their assets.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-card border-border mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-accent fill-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold mb-3">Our Solution</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We built a one-tap cross-rollup NFT bridge that removes all the friction. 
                Select your NFT, tap "Move," and our backend handles everything:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Automatic gas detection and top-up via relayer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Zero chain switching or wallet approvals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Real-time bridge status with friendly updates</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-6 h-6 text-primary fill-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold mb-3">Why This Matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bridging should be invisible. Users shouldn't need to understand gas, 
                relayers, or L2 vs L3. They just want their NFT to arrive safely. 
                This project proves that cross-rollup interoperability can be simple, 
                fast, and user-friendly—no PhD in crypto required.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the hackathon • Powered by Orbit L3 & Arbitrum L2
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
