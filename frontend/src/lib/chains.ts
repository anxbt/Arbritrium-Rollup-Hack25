import { defineChain } from "viem";

export const orbitL3 = defineChain({
  id: Number(import.meta.env.VITE_L3_CHAIN_ID) || 412346,
  name: "Orbit L3 Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  network: "orbit-l3-local",
  rpcUrls: {
    default: { http: [import.meta.env.VITE_L3_RPC_URL || "http://127.0.0.1:8545"] },
    public: { http: [import.meta.env.VITE_L3_RPC_URL || "http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    default: { name: "Localhost", url: "http://127.0.0.1:8545" },
  },
  testnet: true,
});

export const arbitrumL2 = defineChain({
  id: Number(import.meta.env.VITE_L2_CHAIN_ID) || 421614,
  name: "Arbitrum L2 Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  network: "arbitrum-l2-local",
  rpcUrls: {
    default: { http: [import.meta.env.VITE_L2_RPC_URL || "http://127.0.0.1:8546"] },
    public: { http: [import.meta.env.VITE_L2_RPC_URL || "http://127.0.0.1:8546"] },
  },
  blockExplorers: {
    default: { name: "Localhost", url: "http://127.0.0.1:8546" },
  },
  testnet: true,
});

export const appChains = [orbitL3, arbitrumL2];
