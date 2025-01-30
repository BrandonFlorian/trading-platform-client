"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/config/constants'
import { WalletLookupResult } from '@/types'

interface WalletLookupFormProps {
  onLookupResult: (result: WalletLookupResult) => void
}

export function WalletLookupForm({ onLookupResult }: WalletLookupFormProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLookup = async () => {
    if (!walletAddress.trim()) {
      toast.error('Please enter a wallet address')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet details')
      }

      const data = await response.json()
      onLookupResult({
        address: walletAddress,
        solBalance: data.sol_balance,
        tokens: data.tokens
      })

      toast.success('Wallet details retrieved successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Lookup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            placeholder="Enter Solana wallet address" 
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <Button 
            onClick={handleLookup} 
            disabled={isLoading}
          >
            {isLoading ? 'Looking up...' : 'Lookup'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}