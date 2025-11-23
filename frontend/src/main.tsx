import "raf/polyfill";
import "@/lib/ensureMetaMask";
import "@rainbow-me/rainbowkit/styles.css";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { appChains, wagmiConfig } from "@/lib/wagmi";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<WagmiProvider config={wagmiConfig} reconnectOnMount>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider chains={appChains}>
					<App />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</StrictMode>
);
