declare global {
  interface Window {
    ethereum?: any;
    ethereumMetaMask?: any;
  }
}

const setPreferredProvider = () => {
  if (typeof window === "undefined") return;
  const { ethereum } = window;
  if (!ethereum) return;

  if (ethereum.providers?.length) {
    const metaMaskProvider = ethereum.providers.find((provider: any) => provider.isMetaMask);
    if (metaMaskProvider) {
      window.ethereumMetaMask = metaMaskProvider;
      window.ethereum = metaMaskProvider;
      return;
    }
  }

  if (ethereum.isMetaMask) {
    window.ethereumMetaMask = ethereum;
  }
};

setPreferredProvider();

export {};
