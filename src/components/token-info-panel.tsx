"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWatchlistStore } from "@/stores/watchlist-store"
import { usePriceStore } from "@/stores/price-store"
import { formatBalance } from "@/lib/utils"
import usePriceFeed from "@/hooks/use-price-feed-websocket"

interface TokenInfo {
  tokenAddress: string | undefined
}

export const TokenInfoPanel = ({ tokenAddress }: TokenInfo) => {
  const { tokens } = useWatchlistStore()
  const { currentPrice } = usePriceStore()
  const priceFeedData = usePriceFeed({
    baseUrl: process.env.NEXT_PUBLIC_PRICE_FEED_URL || "",
    tokenAddress,
  })
  
  if (!tokenAddress) {
    return <Card className="p-4">Invalid token address</Card>
  }

  const token = tokens.find((t) => t.address === tokenAddress)

  if (!token) {
    return <Card className="p-4">Token not found</Card>
  }

  // Helper function to safely format the price
  const formatPrice = (price: unknown): string => {
    if (typeof price === "number") {
      return price.toFixed(6)
    }
    if (typeof price === "object" && price !== null && "price" in price) {
      const numericPrice = Number((price as { price: unknown }).price)
      return isNaN(numericPrice) ? "N/A" : numericPrice.toFixed(6)
    }
    return "N/A"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Name:</strong> {token.name}
        </p>
        <p>
          <strong>Symbol:</strong> {token.symbol}
        </p>
        <p>
          <strong>Balance:</strong> {formatBalance(Number.parseFloat(token.balance || "0"))}
        </p>
        <p>
          <strong>Market Cap:</strong> ${token.market_cap?.toLocaleString() ?? "N/A"}
        </p>
        <p>
          <strong>Current Price:</strong> ${formatPrice(currentPrice)}
        </p>
      </CardContent>
    </Card>
  )
}

