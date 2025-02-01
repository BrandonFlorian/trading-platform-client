import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'
import { formatBalance } from '@/lib/utils'
import { TokenInfo } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Star } from 'lucide-react'
import Link from 'next/link'

const CompactWalletPanel = () => {
  const { serverWallet, isLoading } = useWalletTrackerStore()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!serverWallet) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Server Wallet</span>
          <span>{formatBalance(serverWallet.balance)} SOL</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="max-h-[400px] overflow-y-auto">
          {serverWallet.tokens.map((token) => (
            <Link 
              key={token.address}
              href={`/trading/${token.address}`}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
            >
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {formatBalance(token.balance)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Star className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CompactWalletPanel