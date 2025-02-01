"use client"
import { useState } from "react";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenInfo } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenRow } from "./token-row";
import { TradePanel } from "./trade-panel";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DexType } from "@/types/crypto";
import { TradeType } from "@/types/ui";

export const ServerWalletCard = () => {
  const {
    serverWallet,
    isLoading,
    error,
    executeBuy,
    executeSell,
    copyTradeSettings,
  } = useWalletTrackerStore();
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [showNewTokenDialog, setShowNewTokenDialog] = useState<boolean>(false);
  const [newTokenAddress, setNewTokenAddress] = useState<string>("");

  const handleCloseTrade = () => {
    setSelectedToken(null);
  };

  const handleCloseNewToken = () => {
    setShowNewTokenDialog(false);
    setNewTokenAddress("");
  };

  const handleTrade = async (type: TradeType, amount: number, dex: DexType) => {
    if (!selectedToken && type === "sell") return;

    try {
      if (type === "buy") {
        await executeBuy(
          selectedToken?.address || newTokenAddress,
          amount,
          copyTradeSettings?.max_slippage || 0.2,
          dex
        );
      } else {
        await executeSell(
          selectedToken!.address,
          amount,
          copyTradeSettings?.max_slippage || 0.2,
          dex
        );
      }
      handleCloseTrade();
      handleCloseNewToken();
    } catch (error) {
      console.error("Trade failed:", error);
      // Error handling is done in the store
    }
  };

  const handleNewToken = () => {
    if (!newTokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }
    // Create a minimal token info object for the trade panel
    const tokenInfo: TokenInfo = {
      address: newTokenAddress,
      symbol: "NEW",
      name: "New Token",
      balance: "0",
      decimals: 9,
      market_cap: 0,
    };
    setSelectedToken(tokenInfo);
    setShowNewTokenDialog(false);
  };

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16 mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!serverWallet) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Server Wallet</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTokenDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Token
              </Button>
              <span>{serverWallet.balance.toFixed(4)} SOL</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>

      <Dialog open={!!selectedToken} onOpenChange={() => handleCloseTrade()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade</DialogTitle>
            <DialogDescription>
              Trade {selectedToken?.symbol} on {}
            </DialogDescription>
          </DialogHeader>
          {selectedToken && (
            <TradePanel
              token={selectedToken}
              onTrade={handleTrade}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewTokenDialog}
        onOpenChange={() => handleCloseNewToken()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy New Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Token Address</label>
              <Input
                value={newTokenAddress}
                onChange={(e) => setNewTokenAddress(e.target.value)}
                placeholder="Enter token address"
              />
            </div>
            <Button onClick={handleNewToken} className="w-full">
              Continue to Trade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
