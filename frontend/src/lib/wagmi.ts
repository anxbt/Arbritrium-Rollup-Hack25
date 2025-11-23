import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { appChains, orbitL3, arbitrumL2 } from "@/lib/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo";

export const wagmiConfig = getDefaultConfig({
  appName: "Orbit NFT Bridge",
  projectId,
  chains: appChains,
  transports: {
    [orbitL3.id]: http(orbitL3.rpcUrls.default.http[0]),
    [arbitrumL2.id]: http(arbitrumL2.rpcUrls.default.http[0]),
  },
  ssr: false,
});

export { appChains };
