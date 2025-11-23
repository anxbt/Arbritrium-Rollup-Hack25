import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Fuel, ArrowLeftRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type BridgeStatus = "fixing-gas" | "bridging" | "completed";

const Status = () => {
  const { txId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<BridgeStatus>("fixing-gas");

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus("bridging"), 2000);
    const timer2 = setTimeout(() => setStatus("completed"), 4000);
    const timer3 = setTimeout(() => navigate("/success"), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  const getStatusConfig = () => {
    switch (status) {
      case "fixing-gas":
        return {
          icon: Fuel,
          title: "Fixing Gas...",
          description: "Our relayer is topping up your wallet",
          color: "text-amber-500",
        };
      case "bridging":
        return {
          icon: ArrowLeftRight,
          title: "Bridging...",
          description: "Moving your NFT across chains",
          color: "text-primary",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          title: "NFT Arrived on L2!",
          description: "Your NFT has landed safely",
          color: "text-green-500",
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 bg-card border-border text-center animate-fade-in">
        <div className="mb-6 w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          {status === "completed" ? (
            <StatusIcon className={`w-12 h-12 ${config.color} fill-current`} />
          ) : (
            <StatusIcon className={`w-12 h-12 ${config.color} animate-pulse`} />
          )}
        </div>

        <h2 className="text-3xl font-heading font-bold mb-3">{config.title}</h2>
        <p className="text-muted-foreground mb-6">{config.description}</p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${status === "fixing-gas" || status === "bridging" || status === "completed" ? "bg-primary" : "bg-muted"}`} />
            <span className="text-sm">Fixing gas</span>
            {(status === "bridging" || status === "completed") && (
              <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
            )}
          </div>
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${status === "bridging" || status === "completed" ? "bg-primary" : "bg-muted"}`} />
            <span className="text-sm">Bridging NFT</span>
            {status === "completed" && (
              <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
            )}
          </div>
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${status === "completed" ? "bg-primary" : "bg-muted"}`} />
            <span className="text-sm">Arriving on L2</span>
            {status === "completed" && (
              <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Transaction ID: {txId}
        </p>
      </Card>
    </div>
  );
};

export default Status;
