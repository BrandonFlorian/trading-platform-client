"use client"

import { useState, useEffect } from "react";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenInfo } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenRow } from "@/components/dashboard/token-row";
import { TradeDialog } from "@/components/dashboard/trade-dialog";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { DexType } from "@/types/crypto";
import { TradeType } from "@/types/ui";
import { API_BASE_URL, TRACKED_WALLET_ADDRESS } from "@/config/constants";

interface ServerToken {
  balance: string;
  decimals: number;
  mint: string;
  name: string;
  raw_balance: number;
  symbol: string;
  uri: string;
}

interface WalletData {
  address: string;
  sol_balance: number;
  tokens: ServerToken[];
}

const API = {
  endpoints: {
    wallet: (address: string) => `/wallet/${address}`,
    trackedWallets: "/tracked_wallets"
  }
};

export function TrackedWalletCard() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { executeBuy, executeSell } = useWalletTrackerStore();

  const fetchWalletData = async () => {
    try {
      setIsRefreshing(true);

      // First try to get tracked wallets
      const fullUrl = `${API_BASE_URL}${API.endpoints.trackedWallets}`;
      console.log("Fetching tracked wallets from:", fullUrl);

      const response = await fetch(fullUrl);

      if (!response.ok) {
        console.log("Response status:", response.status);
        // If tracked wallets fails, try using environment variable
        if (TRACKED_WALLET_ADDRESS) {
          console.log("Using environment wallet address:", TRACKED_WALLET_ADDRESS);
          const walletResponse = await fetch(
            `${API_BASE_URL}${API.endpoints.wallet(TRACKED_WALLET_ADDRESS)}`
          );

          if (!walletResponse.ok) {
            throw new Error(`Failed to fetch wallet data: ${walletResponse.status}`);
          }

          const data = await walletResponse.json();
          console.log("Received wallet data from env:", data);
          setWalletData(data);
          setError(null);
          return;
        }
        throw new Error(`Failed to fetch tracked wallets: ${response.status}`);
      }

      const trackedWallets = await response.json();
      console.log("Received tracked wallets:", trackedWallets);

      if (!trackedWallets || trackedWallets.length === 0) {
        throw new Error("No tracked wallets found");
      }

      // Get the first tracked wallet's data
      const walletAddress = trackedWallets[0].wallet_address;
      console.log("Using tracked wallet address:", walletAddress);

      const walletResponse = await fetch(
        `${API_BASE_URL}${API.endpoints.wallet(walletAddress)}`
      );

      if (!walletResponse.ok) {
        throw new Error(`Failed to fetch wallet data: ${walletResponse.status}`);
      }

      const data = await walletResponse.json();
      console.log("Received wallet data:", data);
      setWalletData(data);
      setError(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wallet data';
      console.error("Error fetching wallet data:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTrade = async (type: TradeType, amount: number, dex: DexType) => {
    if (!selectedToken) return;

    try {
      if (type === 'buy') {
        await executeBuy(selectedToken.address, amount, 0.1, dex);
      } else {
        await executeSell(selectedToken.address, amount, 0.1, dex);
      }
      setSelectedToken(null);
      fetchWalletData(); // Refresh data after trade
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Trade failed: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 shadow-xl">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchWalletData} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Crypto Treasury
            </span>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchWalletData}
                disabled={isRefreshing}
                className="hover:bg-white/20"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                {walletData?.sol_balance.toFixed(4)} SOL
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 rounded-lg bg-white/40 dark:bg-black/20 p-4 backdrop-blur-sm">
            {walletData?.tokens.map((token) => {
              const tokenInfo: TokenInfo = {
                address: token.mint,
                symbol: token.symbol,
                name: token.name,
                balance: token.balance,
                decimals: token.decimals,
                metadata_uri: token.uri,
                market_cap: 0
              };
              return (
                <TokenRow
                  key={token.mint}
                  token={tokenInfo}
                  onClickTrade={() => setSelectedToken(tokenInfo)}
                />
              );
            })}

            {walletData?.tokens.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tokens found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedToken && (
        <TradeDialog
          isOpen={!!selectedToken}
          onClose={() => setSelectedToken(null)}
          token={selectedToken}
          onTrade={handleTrade}
          isLoading={isLoading}
        />
      )}
    </>
  );
}