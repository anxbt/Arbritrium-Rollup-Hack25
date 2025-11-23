// Contract addresses and chain configurations
export const CHAINS = {
  L3: {
    chainId: Number(import.meta.env.VITE_L3_CHAIN_ID) || 412346,
    name: "Orbit L3",
    rpcUrl: import.meta.env.VITE_L3_RPC_URL || "http://127.0.0.1:8545",
    contract: import.meta.env.VITE_L3_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
  L2: {
    chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) || 421614,
    name: "Arbitrum L2",
    rpcUrl: import.meta.env.VITE_L2_RPC_URL || "http://127.0.0.1:8546",
    contract: import.meta.env.VITE_L2_CONTRACT || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

// OrbitNFT ABI (L3 Contract)
export const ORBIT_NFT_ABI = [
  "function mint() external returns (uint256)",
  "function bridgeToL2(uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function nextId() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event BridgeIntent(uint256 indexed tokenId, address indexed owner, bytes32 indexed dest)",
];

// L2BridgeNFT ABI (L2 Contract)
export const L2_BRIDGE_NFT_ABI = [
  "function redeem(bytes32 intentHash, uint256 l3TokenId, address owner) external",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function nextId() view returns (uint256)",
  "function consumedIntents(bytes32) view returns (bool)",
  "event Redeemed(uint256 l3TokenId, address owner)",
];

// Helper to add custom chain to MetaMask
export const addChainToMetaMask = async (chain: keyof typeof CHAINS) => {
  const config = CHAINS[chain];
  
  try {
    await window.ethereum.request({
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
  } catch (error) {
    console.error("Error adding chain:", error);
    return false;
  }
};

// Helper to switch chain in MetaMask
export const switchChain = async (chain: keyof typeof CHAINS) => {
  const config = CHAINS[chain];
  
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${config.chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // Chain not added, try adding it
    if (error.code === 4902) {
      return await addChainToMetaMask(chain);
    }
    console.error("Error switching chain:", error);
    return false;
  }
};
