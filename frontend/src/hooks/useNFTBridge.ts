import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { CHAINS } from "@/config/contracts";

export interface NFT {
  tokenId: number;
  owner: string;
  chain: string;
}

// Helper to create a direct signer for local testing (Anvil account #0)
async function getDirectSigner() {
  try {
    // Only use this for local development
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocal) return null;

    // Anvil account #0 private key - ONLY for local testing
    const ANVIL_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    
    // Get L3 provider
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(ANVIL_PRIVATE_KEY);
    return signer;
  } catch (error) {
    // Silently fail - direct signer is only for local testing
    return null;
  }
}

export const useNFTBridge = () => {
  const { account, l3Contract, l2Contract, chainId, switchToL3, switchToL2 } = useWeb3();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);

  // Fetch user's NFTs from L3
  const fetchL3NFTs = async () => {
    if (!account || !l3Contract) {
      console.log("No account or L3 contract");
      return [];
    }

    try {
      // Switch to L3 if not already on it
      if (chainId !== CHAINS.L3.chainId) {
        const switched = await switchToL3();
        if (!switched) {
          toast({
            title: "Chain Switch Required",
            description: "Please switch to L3 chain to view your NFTs",
            variant: "destructive",
          });
          return [];
        }
      }

      const balance = await l3Contract.balanceOf(account);
      const balanceNum = Number(balance);
      
      if (balanceNum === 0) {
        return [];
      }

      // Get nextId to know the range of token IDs
      const nextId = await l3Contract.nextId();
      const nextIdNum = Number(nextId);
      
      const userNFTs: NFT[] = [];
      
      // Check each token ID to see if user owns it
      for (let tokenId = 1; tokenId < nextIdNum; tokenId++) {
        try {
          const owner = await l3Contract.ownerOf(tokenId);
          if (owner.toLowerCase() === account.toLowerCase()) {
            userNFTs.push({
              tokenId,
              owner,
              chain: "Orbit L3",
            });
          }
        } catch (error) {
          // Token doesn't exist or is burned, skip it
          continue;
        }
      }

      setNfts(userNFTs);
      return userNFTs;
    } catch (error: any) {
      console.error("Error fetching L3 NFTs:", error);
      toast({
        title: "Error Fetching NFTs",
        description: error.message || "Failed to fetch your NFTs",
        variant: "destructive",
      });
      return [];
    }
  };

  // Fetch user's NFTs from L2
  const fetchL2NFTs = async () => {
    if (!account || !l2Contract) return [];

    try {
      if (chainId !== CHAINS.L2.chainId) {
        await switchToL2();
      }

      const balance = await l2Contract.balanceOf(account);
      const balanceNum = Number(balance);
      
      if (balanceNum === 0) {
        return [];
      }

      const nextId = await l2Contract.nextId();
      const nextIdNum = Number(nextId);
      
      const userNFTs: NFT[] = [];
      
      for (let tokenId = 1; tokenId < nextIdNum; tokenId++) {
        try {
          const owner = await l2Contract.ownerOf(tokenId);
          if (owner.toLowerCase() === account.toLowerCase()) {
            userNFTs.push({
              tokenId,
              owner,
              chain: "Arbitrum L2",
            });
          }
        } catch (error) {
          continue;
        }
      }

      return userNFTs;
    } catch (error: any) {
      console.error("Error fetching L2 NFTs:", error);
      return [];
    }
  };

  // Mint a new NFT on L3
  const mintNFT = async () => {
    if (!account || !l3Contract) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return null;
    }

    // Ensure we're on L3
    if (chainId !== CHAINS.L3.chainId) {
      const switched = await switchToL3();
      if (!switched) return null;
    }

    setLoading(true);
    try {
      toast({
        title: "Minting NFT",
        description: "Preparing transaction...",
      });

      // Estimate gas before sending transaction
      try {
        const gasEstimate = await l3Contract.mint.estimateGas();
        console.log("Gas estimate for mint:", gasEstimate.toString());
      } catch (gasError) {
        console.warn("Gas estimation failed, proceeding anyway:", gasError);
      }

      let tx;
      
      // Try direct signer first (for local testing)
      try {
        const directSigner = await getDirectSigner();
        if (directSigner) {
          console.log("Using direct signer for local testing");
          const provider = new BrowserProvider(window.ethereum);
          const l3ABI = ["function mint() public"];
          const directContract = new Contract(l3Contract.target, l3ABI, directSigner);
          tx = await directContract.mint();
        } else {
          // Fall back to wallet provider
          tx = await l3Contract.mint();
        }
      } catch (error: any) {
        console.error("Direct signer or wallet provider failed:", error);
        
        // Provide specific error messages for common issues
        if (error.message.includes("user rejected")) {
          toast({
            title: "Transaction Rejected",
            description: "You rejected the transaction in your wallet",
            variant: "destructive",
          });
          return null;
        }
        
        if (error.message.includes("insufficient funds")) {
          toast({
            title: "Insufficient Funds",
            description: "You don't have enough gas to mint this NFT",
            variant: "destructive",
          });
          return null;
        }
        
        throw error;
      }
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction failed - no receipt received");
      }
      
      // Extract tokenId from Transfer event
      const transferEvent = receipt.logs.find((log: any) => 
        log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      );
      
      const tokenId = transferEvent ? parseInt(transferEvent.topics[3], 16) : null;

      if (!tokenId) {
        console.warn("Could not extract tokenId from transfer event");
      }

      toast({
        title: "NFT Minted!",
        description: `Successfully minted NFT #${tokenId}`,
      });

      // Refresh NFT list
      await fetchL3NFTs();
      
      return tokenId;
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      
      // Provide user-friendly error messages
      let errorDescription = "Failed to mint NFT";
      
      if (error.code === "ACTION_REJECTED") {
        errorDescription = "You rejected the transaction in your wallet";
      } else if (error.message?.includes("insufficient")) {
        errorDescription = "Insufficient balance or gas";
      } else if (error.message) {
        errorDescription = error.message.slice(0, 100);
      }
      
      toast({
        title: "Minting Failed",
        description: errorDescription,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Bridge NFT from L3 to L2
  const bridgeNFT = async (tokenId: number) => {
    if (!account || !l3Contract) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    // Ensure we're on L3
    if (chainId !== CHAINS.L3.chainId) {
      const switched = await switchToL3();
      if (!switched) return false;
    }

    setLoading(true);
    try {
      // Verify ownership
      const owner = await l3Contract.ownerOf(tokenId);
      if (owner.toLowerCase() !== account.toLowerCase()) {
        toast({
          title: "Not Token Owner",
          description: "You don't own this NFT",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Bridging NFT",
        description: "Preparing transaction...",
      });

      // Estimate gas before sending transaction
      try {
        const gasEstimate = await l3Contract.bridgeToL2.estimateGas(tokenId);
        console.log("Gas estimate for bridge:", gasEstimate.toString());
      } catch (gasError) {
        console.warn("Gas estimation failed, proceeding anyway:", gasError);
      }

      let tx;
      
      // Try direct signer first (for local testing)
      try {
        const directSigner = await getDirectSigner();
        if (directSigner) {
          console.log("Using direct signer for bridging");
          const l3ABI = ["function bridgeToL2(uint256 tokenId) public"];
          const directContract = new Contract(l3Contract.target, l3ABI, directSigner);
          tx = await directContract.bridgeToL2(tokenId);
        } else {
          tx = await l3Contract.bridgeToL2(tokenId);
        }
      } catch (error: any) {
        console.error("Direct signer or wallet provider failed:", error);
        
        if (error.message.includes("user rejected")) {
          toast({
            title: "Transaction Rejected",
            description: "You rejected the transaction in your wallet",
            variant: "destructive",
          });
          return false;
        }
        
        if (error.message.includes("insufficient funds")) {
          toast({
            title: "Insufficient Funds",
            description: "You don't have enough gas to bridge this NFT",
            variant: "destructive",
          });
          return false;
        }
        
        throw error;
      }
      
      toast({
        title: "Transaction Sent",
        description: "NFT is being bridged to L2. This may take a few moments...",
      });

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Bridge transaction failed - no receipt received");
      }

      toast({
        title: "Bridge Initiated!",
        description: "Your NFT has been burned on L3. The relayer will mint it on L2 shortly.",
      });

      // Refresh NFT list
      await fetchL3NFTs();
      
      return true;
    } catch (error: any) {
      console.error("Error bridging NFT:", error);
      
      // Provide user-friendly error messages
      let errorDescription = "Failed to bridge NFT";
      
      if (error.code === "ACTION_REJECTED") {
        errorDescription = "You rejected the transaction in your wallet";
      } else if (error.message?.includes("insufficient")) {
        errorDescription = "Insufficient balance or gas";
      } else if (error.message?.includes("Not token owner")) {
        errorDescription = "You don't own this NFT";
      } else if (error.message) {
        errorDescription = error.message.slice(0, 100);
      }
      
      toast({
        title: "Bridge Failed",
        description: errorDescription,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    nfts,
    loading,
    fetchL3NFTs,
    fetchL2NFTs,
    mintNFT,
    bridgeNFT,
  };
};
