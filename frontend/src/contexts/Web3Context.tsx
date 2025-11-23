import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { CHAINS, ORBIT_NFT_ABI, L2_BRIDGE_NFT_ABI } from "@/config/contracts";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useDisconnect, useSwitchChain, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface Web3ContextType {
  account: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: BrowserProvider | null;
  l3Contract: Contract | null;
  l2Contract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToL3: () => Promise<boolean>;
  switchToL2: () => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [l3Contract, setL3Contract] = useState<Contract | null>(null);
  const [l2Contract, setL2Contract] = useState<Contract | null>(null);
  const { toast } = useToast();
  const { address, status } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const account = address ?? null;
  const isConnecting = status === "connecting";
  const isConnected = status === "connected";

  // Initialize contracts when provider and account change
  useEffect(() => {
    if (provider && account) {
      initializeContracts();
    }
  }, [provider, account]);

  const initializeContracts = async () => {
    if (!provider) {
      console.log("No provider available for contract initialization");
      return;
    }

    try {
      console.log("Initializing contracts with provider and account:", account);
      const signer = await provider.getSigner();
      
      const l3 = new Contract(CHAINS.L3.contract, ORBIT_NFT_ABI, signer);
      const l2 = new Contract(CHAINS.L2.contract, L2_BRIDGE_NFT_ABI, signer);
      
      setL3Contract(l3);
      setL2Contract(l2);
      console.log("✅ Contracts initialized:", {
        l3: CHAINS.L3.contract,
        l2: CHAINS.L2.contract
      });
    } catch (error) {
      console.error("❌ Error initializing contracts:", error);
    }
  };

  useEffect(() => {
    setChainId(walletClient?.chain?.id ?? null);
  }, [walletClient]);

  useEffect(() => {
    const setupProvider = async () => {
      if (typeof window === "undefined") {
        console.log("Window undefined, skipping provider setup");
        return;
      }

      const ethereum = (window as any).ethereum;
      console.log("Ethereum provider available:", !!ethereum);

      if (!ethereum) {
        console.log("No ethereum provider found");
        setProvider(null);
        setL3Contract(null);
        setL2Contract(null);
        return;
      }

      // If walletClient is ready, use it; otherwise set up provider directly
      if (walletClient) {
        const browserProvider = new BrowserProvider(ethereum);
        console.log("Setting up provider from walletClient");
        setProvider(browserProvider);
      } else if (account) {
        // Fallback: if account is connected but walletClient isn't ready yet, set up provider anyway
        const browserProvider = new BrowserProvider(ethereum);
        console.log("Setting up provider from ethereum directly (walletClient not ready)");
        setProvider(browserProvider);
      }
    };

    setupProvider();
  }, [walletClient, account]);

  useEffect(() => {
    if (!provider || !account) {
      setBalance(null);
      return;
    }

    let ignore = false;

    const fetchBalance = async () => {
      try {
        const bal = await provider.getBalance(account);
        if (!ignore) {
          setBalance(formatEther(bal));
        }
      } catch (error) {
        console.error("Error fetching balance", error);
      }
    };

    fetchBalance();

    return () => {
      ignore = true;
    };
  }, [provider, account]);

  const connectWallet = async () => {
    if (openConnectModal) {
      openConnectModal();
    } else {
      toast({
        title: "Wallet Connection Unavailable",
        description: "Unable to open the RainbowKit modal. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    if (disconnectAsync) {
      disconnectAsync().catch((err) => console.error("Failed to disconnect", err));
    }
    setBalance(null);
    setChainId(null);
    setProvider(null);
    setL3Contract(null);
    setL2Contract(null);

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchToChain = async (target: keyof typeof CHAINS) => {
    if (!switchChainAsync) {
      toast({
        title: "Switch Unavailable",
        description: "Wallet not ready to switch networks yet.",
        variant: "destructive",
      });
      return false;
    }

    try {
      await switchChainAsync({ chainId: CHAINS[target].chainId });
      return true;
    } catch (error: any) {
      toast({
        title: `Switch to ${CHAINS[target].name} failed`,
        description: error.message || "User rejected the network switch",
        variant: "destructive",
      });
      return false;
    }
  };

  const switchToL3 = () => switchToChain("L3");
  const switchToL2 = () => switchToChain("L2");

  const value: Web3ContextType = {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    provider,
    l3Contract,
    l2Contract,
    connectWallet,
    disconnectWallet,
    switchToL3,
    switchToL2,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
