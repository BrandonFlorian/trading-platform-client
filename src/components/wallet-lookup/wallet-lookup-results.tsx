"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TokenRow } from '@/components/dashboard/token-row'
import { WalletLookupResult, TrackedWallet } from '@/types'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'
import { API_BASE_URL } from '@/config/constants'
import { toast } from 'sonner'

interface WalletLookupResultsProps {
  walletDetails: WalletLookupResult
}

export function WalletLookupResults({ walletDetails }: WalletLookupResultsProps) {
  const [isTracking, setIsTracking] = useState(false)
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

  return (
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
          <p className="font-medium">Wallet Address: {walletDetails.address}</p>
          <p>SOL Balance: {walletDetails.solBalance.toFixed(4)} SOL</p>
        </div>
        {walletDetails.tokens.length > 0 ? (
          walletDetails.tokens.map((token, index) => {
            const transformedToken = {
              address: token.address,
              symbol: token.symbol,
              name: token.name,
              balance: token.balance?.toString() || '0',
              market_cap: token.market_cap,
              decimals: token.decimals
            }

            return (
              <TokenRow 
                key={`${token.address}-${index}`}
                token={transformedToken}
                onClickTrade={() => {/* Implement trade logic */}}
              />
            )
          })
        ) : (
          <p className="text-muted-foreground">No tokens found in this wallet</p>
        )}
      </CardContent>
    </Card>
  )
}