import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 bg-card border-border text-center animate-fade-in">
        <div className="mb-6 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow-pulse">
          <CheckCircle2 className="w-12 h-12 text-primary-foreground fill-primary-foreground" />
        </div>

        <h2 className="text-4xl font-heading font-bold mb-3">
          <span className="text-gradient">Success!</span>
        </h2>
        <h3 className="text-2xl font-heading font-semibold mb-4">
          Your NFT Has Landed Safely on L2
        </h3>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          No drama, no fuss. Your NFT is now chillin' on Arbitrum L2, 
          ready for whatever comes next.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/bridge")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover-glow group"
          >
            Bridge Another NFT
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="border-border hover:bg-card text-foreground font-semibold"
          >
            <Home className="mr-2 w-4 h-4" />
            Back Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Success;
