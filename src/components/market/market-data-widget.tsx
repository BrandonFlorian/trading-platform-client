// src/components/market/market-data-widget.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading"
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store"
import { formatBalance } from "@/lib/utils"
import { BadgeDelta } from "@tremor/react"
import { useRef } from "react"

interface MarketStat {
  title: string
  value: string
  change?: number
}

const validatePrice = (price: number, previousPrice: number): boolean => {
  const maxChangePercent = 5 // Max 5% change per update
  const change = Math.abs((price - previousPrice) / previousPrice * 100)
  return change <= maxChangePercent
}

const smoothPrice = (current: number, previous: number): number => {
  const smoothingFactor = 0.2
  return previous + (current - previous) * smoothingFactor
}

export function MarketDataWidget() {
  const { serverWallet, isLoading } = useWalletTrackerStore()
  const previousPrices = useRef<Map<string, number>>(new Map())

  const getStablePrice = (token: TokenInfo): number => {
    const currentPrice = token.price_sol || 0
    const previousPrice = previousPrices.current.get(token.mint) || currentPrice
    
    if (!validatePrice(currentPrice, previousPrice)) {
      console.warn(`Invalid price change for ${token.symbol}: ${currentPrice}`)
      return previousPrice
    }

    const smoothed = smoothPrice(currentPrice, previousPrice)
    previousPrices.current.set(token.mint, smoothed)
    return smoothed
  }

  const stats: MarketStat[] = [
    {
      title: "Portfolio Value",
      value: formatBalance(serverWallet?.balance || 0) + " SOL",
      change: 2.5
    },
    {
      title: "24h Volume",
      value: "$1.2M",
      change: -0.4
    },
    {
      title: "Active Positions",
      value: serverWallet?.tokens?.length.toString() || "0"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Market Overview</span>
          {isLoading && <LoadingSpinner size="sm" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat, idx) => (
            <div
              key={`${stat.title}-${idx}`}
              className="flex flex-col space-y-1 rounded-lg bg-accent/50 p-4"
            >
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold">{stat.value}</p>
                {stat.change !== undefined && (
                  <BadgeDelta
                    deltaType={stat.change >= 0 ? "increase" : "decrease"}
                    className="text-xs"
                  >
                    {Math.abs(stat.change)}%
                  </BadgeDelta>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center p-4 text-sm">
              <div className="flex-1">Token</div>
              <div className="flex-1 text-right">Price</div>
              <div className="flex-1 text-right">Change</div>
            </div>
            {serverWallet?.tokens?.map((token) => (
              <div
                key={token.mint}
                className="flex items-center border-t p-4 text-sm hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 font-medium">{token.symbol}</div>
                <div className="flex-1 text-right">
                  {formatBalance(getStablePrice(token))} SOL
                </div>
                <div className="flex-1 text-right">
                  <BadgeDelta deltaType="increase" size="xs">
                    2.5%
                  </BadgeDelta>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}