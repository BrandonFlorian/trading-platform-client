"use client"

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TokenRow } from "@/components/dashboard/token-row";
import { API_BASE_URL } from "@/config/constants";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface TrackedWallet {
  wallet_address: string;
  is_active: boolean;
}

interface TokenData {
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
  tokens: TokenData[];
}

export function WalletLookup() {

  const [walletAddress, setWalletAddress] = useState("");
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationSettings, setConfirmationSettings] = useState({
    saveAddress: false,
    makeTracked: false,
  });


  useEffect(() => {
    fetchTrackedWallets();
  }, []);


  const fetchTrackedWallets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracked_wallets`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracked wallets');
      }
      const data = await response.json();
      setTrackedWallets(data);
    } catch (error) {
      console.error('Error fetching tracked wallets:', error);
      toast.error('Failed to load tracked wallets');
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLookupTrigger();
    }
  };


  const handleLookupTrigger = () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }
    setShowConfirmation(true);
  };


  const handleConfirmLookup = async () => {
    setShowConfirmation(false);
    await fetchWalletData();

    if (confirmationSettings.makeTracked) {
      await handleTrackingToggle(walletAddress, true);
    }
  };


  const handleTrackingToggle = async (address: string, shouldTrack: boolean) => {
    try {
      const method = shouldTrack ? 'POST' : 'DELETE';
      const endpoint = shouldTrack
        ? '/tracked_wallets'
        : `/tracked_wallets/${address}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'POST'
          ? JSON.stringify({
            wallet_address: address,
            is_active: true,
            preserve_settings: true // Preserve copy trade settings
          })
          : undefined,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${shouldTrack ? 'track' : 'untrack'} wallet`);
      }

      toast.success(`Wallet ${shouldTrack ? 'tracked' : 'untracked'} successfully`);
      fetchTrackedWallets();
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast.error('Failed to update tracking status');
    }
  };


  const fetchWalletData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fullUrl = `${API_BASE_URL}/wallet/${walletAddress}`;
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch wallet data: ${response.status}`);
      }

      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load wallet data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Wallet Lookup Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 font-mono"
            />
            <Button
              onClick={handleLookupTrigger}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Look Up"}
            </Button>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Tracked Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <div className="space-y-2 p-4">
              {trackedWallets.map((wallet) => (
                <div
                  key={wallet.wallet_address}
                  className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                >
                  <span className="font-mono text-sm">{wallet.wallet_address}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setWalletAddress(wallet.wallet_address);
                        handleLookupTrigger();
                      }}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTrackingToggle(wallet.wallet_address, false)}
                    >
                      Untrack
                    </Button>
                  </div>
                </div>
              ))}
              {trackedWallets.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No tracked wallets
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>


      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Wallet Lookup</DialogTitle>
            <DialogDescription>
              Please confirm the wallet address and settings:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-secondary rounded-lg font-mono break-all">
              {walletAddress}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLookup}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : walletData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Wallet Details</span>
              <span className="font-mono">{walletData.sol_balance.toFixed(4)} SOL</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {walletData.tokens.map((token) => (
                <TokenRow
                  key={token.mint}
                  token={{
                    address: token.mint,
                    symbol: token.symbol,
                    name: token.name,
                    balance: token.balance,
                    decimals: token.decimals,
                    metadata_uri: token.uri,
                  }}
                  onClickTrade={() => { }} // Placeholder for trade functionality
                />
              ))}

              {walletData.tokens.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tokens found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}