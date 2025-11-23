import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, ArrowRight, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { useNFTBridge } from "@/hooks/useNFTBridge";
import { WalletConnect } from "@/components/WalletConnect";
import { QuickSetup } from "@/components/QuickSetup";
import { MetaMaskDebug } from "@/components/MetaMaskDebug";

const Bridge = () => {
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [recentlyMintedNFT, setRecentlyMintedNFT] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const { nfts, loading, fetchL3NFTs, mintNFT, bridgeNFT } = useNFTBridge();

  // Fetch NFTs when wallet connects
  useEffect(() => {
    if (isConnected) {
      fetchL3NFTs();
    }
  }, [isConnected]);

  const handleBridge = async () => {
    if (selectedNFT) {
      const success = await bridgeNFT(selectedNFT);
      if (success) {
        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate("/success");
        }, 2000);
      }
    }
  };

  const handleMint = async () => {
    const tokenId = await mintNFT();
    if (tokenId) {
      setRecentlyMintedNFT(tokenId);
      setSelectedNFT(tokenId);
    }
  };

  const handleRefresh = async () => {
    await fetchL3NFTs();
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Select Your <span className="text-gradient">NFT</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Pick the NFT you want to move from L3 to Arbitrum L2
          </p>
          <div className="flex items-center justify-center gap-4">
            <QuickSetup />
            <WalletConnect />
            {isConnected && (
              <>
                <Button
                  onClick={handleMint}
                  disabled={loading}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Mint NFT
                </Button>
                <Button
                  onClick={handleRefresh}
                  disabled={loading}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </>
            )}
          </div>
        </div>

        {!isConnected ? (
          <>
            <Card className="p-12 text-center">
              <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-heading font-semibold mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground">
                Connect your wallet to view and bridge your NFTs
              </p>
            </Card>
            <MetaMaskDebug />
          </>
        ) : nfts.length === 0 && !loading ? (
          <Card className="p-12 text-center">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-heading font-semibold mb-2">
              No NFTs Found
            </h3>
            <p className="text-muted-foreground mb-4">
              You don't have any NFTs on L3. Mint one to get started!
            </p>
            <Button onClick={handleMint} disabled={loading} className="gap-2">
              <Plus className="w-4 h-4" />
              Mint Your First NFT
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {nfts.map((nft) => (
                <Card
                  key={nft.tokenId}
                  onClick={() => setSelectedNFT(nft.tokenId)}
                  className={`p-6 cursor-pointer transition-all duration-300 hover-glow ${
                    selectedNFT === nft.tokenId
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-4 flex items-center justify-center text-6xl">
                    🎨
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">
                    NFT #{nft.tokenId}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="w-4 h-4" />
                    <span>{nft.chain}</span>
                  </div>
                </Card>
              ))}
            </div>

            {selectedNFT && (
              <Card className="p-8 bg-card border-border animate-fade-in">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-heading font-bold mb-2">
                      Bridge Details
                    </h3>
                    {recentlyMintedNFT === selectedNFT && (
                      <p className="text-sm text-accent mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-accent rounded-full"></span>
                        Just minted! Review before bridging
                      </p>
                    )}
                    <p className="text-muted-foreground mb-4">
                      Moving{" "}
                      <span className="text-primary font-semibold">
                        NFT #{selectedNFT}
                      </span>{" "}
                      to Arbitrum L2
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-primary">
                        From: Orbit L3
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="px-3 py-1 bg-accent/10 rounded-full text-accent">
                        To: Arbitrum L2
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {recentlyMintedNFT === selectedNFT && (
                      <Button
                        size="lg"
                        variant="outline"
                        disabled={loading}
                        className="text-accent border-accent hover:bg-accent/10"
                        onClick={() => setRecentlyMintedNFT(null)}
                      >
                        Review NFT
                      </Button>
                    )}
                    <Button
                      size="lg"
                      onClick={handleBridge}
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg hover-glow group"
                    >
                      {loading ? "Bridging..." : "Bridge NFT"}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bridge;

