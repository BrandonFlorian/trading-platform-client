import { useState } from "react";
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TokenInfo } from "@/types";
import { TokenRow } from "./token-row";
import { TradePanel } from "./trade-panel";
import ServerWalletCardSkeleton from "@/components/server-wallet-card-skeleton";
import { DexType } from "@/types/crypto";

export const ServerWalletCard = () => {
  const {
    serverWallet,
    error,
    executeBuy,
    executeSell,
    copyTradeSettings,
    loadingStates
  } = useWalletTrackerStore();

  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [showNewTokenDialog, setShowNewTokenDialog] = useState<boolean>(false);
  const [newTokenAddress, setNewTokenAddress] = useState<string>("");

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

  if (loadingStates.walletInfo) {
    return <ServerWalletCardSkeleton />;
  }

  if (!serverWallet) return null;

  const handleTrade = async (type: "buy" | "sell", amount: number, dex: DexType) => {
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
      setSelectedToken(null);
      setShowNewTokenDialog(false);
      setNewTokenAddress("");
    } catch (error) {
      console.error("Trade failed:", error);
      throw error; // Re-throw to be handled by TokenRow
    }
  };

  const handleClickTrade = async (token: TokenInfo): Promise<void> => {
    setSelectedToken(token);
  };

  const handleNewToken = () => {
    if (!newTokenAddress.trim()) {
      toast.error("Please enter a token address");
      return;
    }
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
          {serverWallet.tokens.map((token: TokenInfo) => (
            <TokenRow
              key={token.address}
              token={token}
              onClickTrade={() => handleClickTrade(token)}
            />
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selectedToken} onOpenChange={() => setSelectedToken(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trade {selectedToken?.symbol}</DialogTitle>
          </DialogHeader>
          {selectedToken && (
            <TradePanel
              token={selectedToken}
              onTrade={handleTrade}
              isLoading={loadingStates.trade}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showNewTokenDialog}
        onOpenChange={() => setShowNewTokenDialog(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy New Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
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