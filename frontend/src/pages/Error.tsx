import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 bg-card border-border text-center animate-fade-in">
        <div className="mb-6 w-24 h-24 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>

        <h2 className="text-3xl font-heading font-bold mb-3">
          Something Tripped
        </h2>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Looks like we hit a bump. Don't worry—your NFT is safe. 
          Give it another shot or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-border hover:bg-card text-foreground font-semibold"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Try Again
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover-glow"
          >
            <Home className="mr-2 w-4 h-4" />
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Error;
