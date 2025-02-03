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
import { TradeType } from '@/types/ui'
import { DexType } from '@/types/crypto'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'

export function TrackedWalletsPanel() {
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([])
  const [selectedWallet, setSelectedWallet] = useState<TrackedWallet | null>(null)
  const [walletDetails, setWalletDetails] = useState<WalletUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null)
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [isTradeLoading, setIsTradeLoading] = useState(false)

  const { executeBuy, executeSell, copyTradeSettings } = useWalletTrackerStore()
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
      setWalletDetails({
        balance: details.sol_balance,
        address: details.address,
        tokens: details.tokens
      })
    } catch (error) {
      console.error('Error fetching wallet details:', error)
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

  // const handleTrade = async (type: 'buy' | 'sell', amount: number, dex: string) => {
  //   setIsTradeLoading(true)
  //   try {
  //     const endpoint = type === 'buy' ? 'buy_token' : 'sell_token'
  //     const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         token_address: selectedToken?.address,
  //         sol_quantity: type === 'buy' ? amount : undefined,
  //         token_quantity: type === 'sell' ? amount : undefined,
  //         slippage_tolerance: 0.2,
  //         dex: dex
  //       })
  //     })

  //     if (!response.ok) throw new Error('Trade failed')
  //     toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} order placed successfully`)
  //     setIsTradeDialogOpen(false)
  //   } catch (error) {
  //     toast.error('Failed to place trade order')
  //     console.error('Trade error:', error)
  //   } finally {
  //     setIsTradeLoading(false)
  //   }
  // }

  const handleTokenTrade = (token: TokenInfo) => {
    setSelectedToken(token);
    setIsTradeDialogOpen(true);
    handleTrade("buy", 0.000001, "jupiter")
  }
  const handleTrade = async (type: TradeType, amount: number, dex: DexType) => {
    try {
      if (type === "buy") {
        if (!selectedToken?.mint) {
          toast.error("No token address provided");
          return;
        }

        await executeBuy(
          selectedToken?.mint,
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

    } catch (error) {
      console.error("Trade failed:", error);
    } finally {
      setIsTradeDialogOpen(false)
    }
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">Tracked Wallets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Select
            value={selectedWallet?.wallet_address}
            onValueChange={handleWalletSelect}
          >
            <SelectTrigger className="w-full">
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
        </div>

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
              <span>{walletDetails?.balance?.toFixed(4) || '0.0000'} SOL</span>
            </div>
            {walletDetails.tokens && walletDetails.tokens.length > 0 ? (
              walletDetails.tokens.map((token, index) => (
                <TokenRow
                  key={`${token.mint}-${index}`}
                  token={{
                    address: token.mint,
                    symbol: token.symbol,
                    name: token.name,
                    balance: token.raw_balance || '0',
                    market_cap: token.market_cap,
                    decimals: token.decimals
                  }}
                  onClickTrade={() => handleTokenTrade({
                    mint: token.mint,
                    symbol: token.symbol,
                    name: token.name,
                    raw_balance: token.raw_balance || '0',
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

        <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Trade Token</DialogTitle>
            </DialogHeader>
            {selectedToken && (
              <TradePanel
                token={{
                  address: selectedToken.mint,
                  symbol: selectedToken.symbol,
                  name: selectedToken.name,
                  balance: selectedToken.raw_balance || '0',
                  market_cap: selectedToken.market_cap,
                  decimals: selectedToken.decimals
                }}
                onTrade={handleTrade}
                isLoading={isTradeLoading}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}