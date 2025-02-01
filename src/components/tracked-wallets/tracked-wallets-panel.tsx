"use client"

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TrackedWallet, WalletUpdate, TokenInfo } from '@/types'
import { API_BASE_URL } from '@/config/constants'
import { TokenRow } from '@/components/dashboard/token-row'
import { TradePanel } from '@/components/dashboard/trade-panel'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export const TrackedWalletsPanel = () => {
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<TrackedWallet | null>(null)
  const [walletDetails, setWalletDetails] = useState<WalletUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null)
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [isTradeLoading, setIsTradeLoading] = useState(false)

  useEffect(() => {
    fetchTrackedWallets()
  }, [])

  const fetchTrackedWallets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracked_wallets`)
      if (!response.ok) throw new Error('Failed to fetch tracked wallets')

      const wallets = await response.json()
      setTrackedWallets(wallets)

      if (wallets.length > 0) {
        setSelectedWallet(wallets[0])
      }
    } catch (error) {
      toast.error('Failed to load tracked wallets')
    }
  }

  const fetchWalletDetails = async (walletAddress: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}`)
      if (!response.ok) throw new Error('Failed to fetch wallet details')

      const details = await response.json()
      setWalletDetails(details)
    } catch (error) {
      toast.error('Failed to load wallet details')
      setWalletDetails(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedWallet) {
      fetchWalletDetails(selectedWallet.wallet_address)
    }
  }, [selectedWallet])

  const handleWalletSelect = (walletAddress: string) => {
    const wallet = trackedWallets.find(w => w.wallet_address === walletAddress)
    if (wallet) {
      setSelectedWallet(wallet)
    }
  }

  const handleTrade = async (type: 'buy' | 'sell', amount: number, dexType: string) => {
    if (!selectedToken) return;

    setIsTradeLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_address: selectedToken.address,
          type,
          amount,
          dex: dexType
        })
      });

      if (!response.ok) {
        throw new Error('Trade failed');
      }

      const result = await response.json();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} order placed successfully`);
      setIsTradeDialogOpen(false);
    } catch (error) {
      toast.error('Failed to place trade order');
      console.error(error);
    } finally {
      setIsTradeLoading(false);
    }
  }

  const handleTokenTrade = (token: TokenInfo) => {
    setSelectedToken(token);
    setIsTradeDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tracked Wallets</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Wallet Details</span>
              <Select
                value={selectedWallet?.wallet_address}
                onValueChange={handleWalletSelect}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {trackedWallets.map((wallet, index) => (
                    <SelectItem
                      key={`${wallet.wallet_address}-${index}`}
                      value={wallet.wallet_address}
                    >
                      {wallet.wallet_address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
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
              </div>
            ) : walletDetails ? (
              <>
                <div className="mb-4">
                  <span className="font-medium">SOL Balance:</span> {walletDetails.balance !== undefined ? walletDetails.balance.toFixed(4) : '0.0000'} SOL
                </div>
                {walletDetails.tokens && walletDetails.tokens.length > 0 ? (
                  walletDetails.tokens.map((token, index) => (
                    <TokenRow
                      key={`${token.mint}-${index}`}
                      token={{
                        address: token.mint,
                        symbol: token.symbol,
                        name: token.name,
                        balance: token.raw_balance,
                        market_cap: token.market_cap,
                        decimals: token.decimals
                      }}
                      onClickTrade={() => handleTokenTrade({
                        address: token.mint,
                        symbol: token.symbol,
                        name: token.name,
                        balance: token.raw_balance,
                        market_cap: token.market_cap,
                        decimals: token.decimals
                      })}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No tokens found in this wallet
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No wallet selected or wallet details not available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trade Token</DialogTitle>
          </DialogHeader>
          {selectedToken && (
            <TradePanel
              token={selectedToken}
              onTrade={handleTrade}
              isLoading={isTradeLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}