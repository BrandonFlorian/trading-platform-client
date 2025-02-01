"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TokenRow } from '@/components/dashboard/token-row'
import { TradePanel } from '@/components/dashboard/trade-panel'
import { TrackedWallet, WalletUpdate, TokenInfo } from '@/types'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'
import { API_BASE_URL } from '@/config/constants'
import { toast } from 'sonner'

interface WalletLookupResultsProps {
  walletDetails: WalletUpdate
}

export function WalletLookupResults({ walletDetails }: WalletLookupResultsProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null)
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const { addTrackedWallet } = useWalletTrackerStore()

  const handleTrackWallet = async () => {
    setIsTracking(true)
    try {
      const response = await fetch(`${API_BASE_URL}/tracked_wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletDetails.address,
          is_active: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to track wallet')
      }

      const result = await response.json()
      const newWallet: TrackedWallet = {
        id: result.tracked_wallet_id,
        wallet_address: walletDetails.address,
        is_active: true,
        user_id: undefined,
        created_at: undefined,
        updated_at: undefined
      }

      addTrackedWallet(newWallet)
      toast.success('Wallet added to tracked wallets')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsTracking(false)
    }
  }

  const handleTokenTrade = (token: TokenInfo) => {
    setSelectedToken(token)
    setIsTradeDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Wallet Details</CardTitle>
          <Button 
            onClick={handleTrackWallet} 
            disabled={isTracking}
          >
            {isTracking ? 'Adding...' : 'Track Wallet'}
          </Button>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trade Token</DialogTitle>
          </DialogHeader>
          {selectedToken && (
            <TradePanel 
              token={selectedToken} 
              onTrade={async () => {}} 
              isLoading={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}