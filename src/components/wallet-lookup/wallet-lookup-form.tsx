"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { API_BASE_URL } from '@/config/constants'
import { WalletLookupResult } from '@/types'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'

interface WalletLookupFormProps {
  onLookupResult: (result: WalletLookupResult) => void
}

export function WalletLookupForm({ onLookupResult }: WalletLookupFormProps) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { recentWallets, addRecentWallet } = useWalletTrackerStore()

  const handleLookup = async (address: string = walletAddress) => {
    if (!address.trim()) {
      toast.error('Please enter a wallet address')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${address}`)

      if (!response.ok) {
        throw new Error('Failed to fetch wallet details')
      }

      const data = await response.json()
      const result = {
        address: address,
        balance: data.sol_balance,
        tokens: data.tokens
      }

      const lookupResult = {
        address: address,
        balance: data.sol_balance,
        solBalance: data.sol_balance,
        tokens: data.tokens
      }

      onLookupResult(lookupResult)
      addRecentWallet(lookupResult)

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
            onClick={() => handleLookup()}
            disabled={isLoading}
          >
            {isLoading ? 'Looking up...' : 'Lookup'}
          </Button>
        </div>
        {recentWallets && recentWallets.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Recent:</span>
            <Select onValueChange={(address) => handleLookup(address)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {recentWallets.map((wallet) => (
                  <SelectItem key={wallet.address} value={wallet.address}>
                    {`${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}