import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export const MetaMaskDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkMetaMask = async () => {
    const info: any = {
      timestamp: new Date().toLocaleTimeString(),
      windowEthereumExists: !!window.ethereum,
      ethereumType: typeof window.ethereum,
      isMetaMask: window.ethereum?.isMetaMask,
      providers: [],
      error: null,
    };

    try {
      // Check if window.ethereum exists
      if (window.ethereum) {
        info.providers.push("window.ethereum found");
        
        // Try to get accounts (without requesting)
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          info.existingAccounts = accounts;
          info.hasAccounts = accounts.length > 0;
        } catch (err: any) {
          info.accountsError = err.message;
        }

        // Try to get chain ID
        try {
          const chainId = await window.ethereum.request({ 
            method: 'eth_chainId' 
          });
          info.chainId = chainId;
          info.chainIdDecimal = parseInt(chainId, 16);
        } catch (err: any) {
          info.chainIdError = err.message;
        }

        // Check if it's actually MetaMask
        info.providerInfo = {
          isMetaMask: window.ethereum.isMetaMask,
          isCoinbaseWallet: (window.ethereum as any).isCoinbaseWallet,
          isRabby: (window.ethereum as any).isRabby,
        };
      } else {
        info.error = "window.ethereum is not defined";
      }
    } catch (err: any) {
      info.error = err.message;
    }

    setDebugInfo(info);
  };

  const testConnection = async () => {
    if (!window.ethereum) {
      setDebugInfo({ error: "MetaMask not found!" });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setDebugInfo({
        success: true,
        accounts,
        message: "Connection successful!"
      });
    } catch (err: any) {
      setDebugInfo({
        error: err.message,
        code: err.code,
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">MetaMask Debug Tool</h3>
        <p className="text-sm text-muted-foreground">
          Check if MetaMask is properly installed and accessible
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={checkMetaMask} variant="outline">
          Check Status
        </Button>
        <Button onClick={testConnection}>
          Test Connection
        </Button>
      </div>

      {debugInfo && (
        <div className="space-y-2">
          <div className="p-4 bg-muted rounded-lg space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              {debugInfo.error ? (
                <>
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="text-destructive">{debugInfo.error}</span>
                </>
              ) : debugInfo.success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{debugInfo.message}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span>Debug Information</span>
                </>
              )}
            </div>
            
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {debugInfo.windowEthereumExists === false && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-sm">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                MetaMask Not Detected
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                Install MetaMask extension and refresh the page.
              </p>
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
              >
                Download MetaMask
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
