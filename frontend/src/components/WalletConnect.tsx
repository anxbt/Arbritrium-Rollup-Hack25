import { ConnectButton } from "@rainbow-me/rainbowkit";

export const WalletConnect = () => (
  <ConnectButton
    accountStatus={{ smallScreen: "address", largeScreen: "full" }}
    chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
    showBalance={{ smallScreen: false, largeScreen: true }}
  />
);
