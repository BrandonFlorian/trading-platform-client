"use client"

import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TokenSkeletons, ChartSkeletons, OrderBookSkeletons } from "@/components/ui/loading-skeleton"
import { useWatchlistStore } from "@/stores/watchlist-store"
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store"
import { MarketDataWidget } from "@/components/market/market-data-widget"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const {
    fetchWatchlists,
    isLoading: watchlistLoading
  } = useWatchlistStore()

  const {
    serverWallet,
    isLoading: walletLoading
  } = useWalletTrackerStore()

  useEffect(() => {
    fetchWatchlists()
  }, [fetchWatchlists])

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {walletLoading ? (
            <TokenSkeletons />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Server Wallet</span>
                  <span>{serverWallet?.balance?.toFixed(4) || 0} SOL</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serverWallet?.tokens.map((token) => (
                  <div
                    key={token.mint}
                    className={cn(
                      "flex justify-between items-center p-4",
                      "hover:bg-accent rounded-lg transition-colors"
                    )}
                  >
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.raw_balance}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{token.price_sol?.toFixed(6)} SOL</div>
                      <div className="text-sm text-muted-foreground">
                        ${token.price_usd?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {watchlistLoading ? (
            <ChartSkeletons />
          ) : (
            <MarketDataWidget />
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Activity content */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Settings content */}
            </CardContent>
          </Card>

          <OrderBookSkeletons />
        </div>
      </div>
    </div>
  )
}