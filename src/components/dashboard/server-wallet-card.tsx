"use client"
import React, { useEffect, useState } from "react";
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

interface Props {
  displayName?: string;
}

export default function ServerWalletCard({ displayName = "Server Wallet" }: Props) {
  const {
    serverWallet,
    isLoading,
    error,
    executeBuy,
    executeSell,
    copyTradeSettings,
    fetchWalletInfo,
  } = useWalletTrackerStore();

  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);

  useEffect(() => {
    fetchWalletInfo();
  }, [fetchWalletInfo]);

  const handleTokenTrade = (token: TokenInfo) => {
    setSelectedToken(token);
    setIsTradeDialogOpen(true);
  };

  const handleNewToken = () => {
    if (!newTokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }

    const tokenInfo: TokenInfo = {
      mint: newTokenAddress,
      symbol: "NEW",
      name: "New Token",
      raw_balance: "0",
      decimals: 9,
      market_cap: 0
    };

    setSelectedToken(tokenInfo);
    setShowNewTokenDialog(false);
  };

  const handleTrade = async (type: TradeType, amount: number, dex: DexType) => {
    try {
      if (type === "buy") {
        const tokenAddress = selectedToken ? selectedToken.mint : newTokenAddress;
        if (!tokenAddress) {
          toast.error("No token address provided");
          return;
        }

        await executeBuy(
          tokenAddress,
          amount,
          copyTradeSettings?.max_slippage || 0.2,
          dex
        );
      } else {
        if (!selectedToken?.mint) {
          toast.error("No token selected for sell");
          return;
        }

        await executeSell(
          selectedToken.mint,
          amount,
          copyTradeSettings?.max_slippage || 0.2,
          dex
        );
      }

      setIsTradeDialogOpen(false);
      setNewTokenAddress("");
      setShowNewTokenDialog(false);
    } catch (error) {
      console.error("Trade failed:", error);
    }
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
            <div key={`skeleton-${i}`} className="flex justify-between items-center">
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">{displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        {serverWallet.tokens?.map((token, index) => (
          <TokenRow
            key={`${token.mint}-${index}`}
            token={{
              address: token.mint,  // Match tracked-wallets format
              symbol: token.symbol,
              name: token.name,
              balance: token.raw_balance,
              market_cap: token.market_cap,
              decimals: token.decimals
            }}
            onClickTrade={() => handleTokenTrade({
              mint: token.mint,  // Match tracked-wallets format
              symbol: token.symbol,
              name: token.name,
              raw_balance: token.raw_balance,
              market_cap: token.market_cap,
              decimals: token.decimals
            })}
          />
        ))}
      </CardContent>
    </Card>
  );
}