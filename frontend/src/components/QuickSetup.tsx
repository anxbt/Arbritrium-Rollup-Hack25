import { Button } from "@/components/ui/button";
import { Settings, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CHAINS } from "@/config/contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const QuickSetup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [l3Added, setL3Added] = useState(false);
  const [l2Added, setL2Added] = useState(false);
  const [accountImported, setAccountImported] = useState(false);
  const { toast } = useToast();

  const getEthereumProvider = () => {
    if (typeof window === "undefined") return null;
    const eth = (window as any).ethereum;
    if (!eth) return null;
    if (eth.providers?.length) {
      const metamask = eth.providers.find((prov: any) => prov.isMetaMask);
      return metamask ?? eth.providers[0];
    }
    return eth;
  };

  const addNetwork = async (chain: keyof typeof CHAINS) => {
    const config = CHAINS[chain];
    const ethereum = getEthereumProvider();
    
    if (!ethereum || typeof ethereum.request !== "function") {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${config.chainId.toString(16)}`,
            chainName: config.name,
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [config.rpcUrl],
          },
        ],
      });
      return true;
    } catch (error: any) {
      console.error(`Error adding ${chain}:`, error);
      if (error.code === 4902) {
        // Chain already added
        return true;
      }
      return false;
    }
  };

  const setupNetworks = async () => {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Setting Up Networks...",
      description: "Please approve the prompts in MetaMask",
    });

    // Add L3
    const l3Success = await addNetwork("L3");
    setL3Added(l3Success);

    if (!l3Success) {
      toast({
        title: "L3 Setup Failed",
        description: "Failed to add Orbit L3 network",
        variant: "destructive",
      });
      return;
    }

    // Add L2
    const l2Success = await addNetwork("L2");
    setL2Added(l2Success);

    if (!l2Success) {
      toast({
        title: "L2 Setup Failed",
        description: "Failed to add Arbitrum L2 network",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Networks Added! ✅",
      description: "Both L3 and L2 networks have been configured",
    });
  };

  const copyPrivateKey = () => {
    const anvilKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    navigator.clipboard.writeText(anvilKey);
    toast({
      title: "Private Key Copied",
      description: "Paste it in MetaMask to import the account",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Quick Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Setup for Local Demo</DialogTitle>
          <DialogDescription>
            Configure MetaMask for local Anvil chains in 2 steps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Add Networks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Step 1: Add Networks</h3>
              {l3Added && l2Added && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Add both L3 (port 8545) and L2 (port 8546) networks to MetaMask
            </p>
            <Button
              onClick={setupNetworks}
              className="w-full"
              disabled={l3Added && l2Added}
            >
              {l3Added && l2Added ? "Networks Added ✓" : "Add Networks"}
            </Button>
            {l3Added && l2Added && (
              <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <div>✓ L3 (Orbit) - Chain ID: 412346</div>
                <div>✓ L2 (Arbitrum) - Chain ID: 421614</div>
              </div>
            )}
          </div>

          {/* Step 2: Import Account */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Step 2: Import Test Account</h3>
              {accountImported && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Import Anvil's default account with 10,000 ETH
            </p>
            <div className="space-y-2">
              <Button
                onClick={copyPrivateKey}
                variant="outline"
                className="w-full"
              >
                Copy Private Key
              </Button>
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
                <p><strong>Then in MetaMask:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Click account icon → Add account</li>
                  <li>Select "Import account"</li>
                  <li>Paste private key</li>
                  <li>Click Import</li>
                </ol>
              </div>
              <Button
                onClick={() => {
                  setAccountImported(true);
                  toast({
                    title: "Account Setup Complete",
                    description: "You can now close this dialog and connect your wallet",
                  });
                }}
                variant="secondary"
                className="w-full"
                disabled={accountImported}
              >
                {accountImported ? "Account Imported ✓" : "Mark as Complete"}
              </Button>
            </div>
          </div>

          {/* Final Step */}
          {l3Added && l2Added && accountImported && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                🎉 Setup Complete!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Close this dialog and click "Connect Wallet" to start bridging NFTs
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
