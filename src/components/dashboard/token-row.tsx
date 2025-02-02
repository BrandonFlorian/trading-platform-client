import { TokenRowProps } from "@/types/ui"
import { Button } from "@/components/ui/button"
import { formatBalance } from "@/lib/utils"
import { Star } from "lucide-react"
import { useWatchlistStore, WatchlistToken } from "@/stores/watchlist-store"
import { toast } from "sonner"
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store"
import { useRouter } from "next/navigation"

export const TokenRow = ({ token, onClickTrade }: TokenRowProps) => {
  const router = useRouter()
  const { addToken, activeWatchlistId, tokens } = useWatchlistStore()
  const { copyTradeSettings } = useWalletTrackerStore()

  const formattedBalance = formatBalance(parseFloat(token.balance))
  const hasMarketCap = token.market_cap > 0
  const isInWatchlist = tokens.some(t => t.address === token.address)

  const handleTokenClick = () => {
    router.push(`/trading/${token.address}`)
  }

  const handleAddToWatchlist = async () => {
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first')
      return
    }

    try {
      const tokenToAdd: WatchlistToken = {
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        balance: token.balance,
        market_cap: token.market_cap
      }

      await addToken(tokenToAdd)
      toast.success(`${token.symbol} added to watchlist`)
    } catch (error: any) {
      console.error('Error adding token to watchlist:', {
        error: error.message || 'Failed to add token',
        token,
        watchlistId: activeWatchlistId
      })
      toast.error(error.message || 'Failed to add token to watchlist')
    }
  }

  return (
    <div
      className="flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors cursor-pointer"
      onClick={handleTokenClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{token.symbol}</span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {token.name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
        <div className="text-right">
          <div className="font-medium">{formattedBalance}</div>
          {hasMarketCap && (
            <div className="text-sm text-muted-foreground">
              ${formatBalance(parseFloat(token.balance) * token.market_cap)}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onClickTrade()}
          className="min-w-[80px]"
        >
          Trade
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddToWatchlist}
          className={isInWatchlist ? "text-primary" : ""}
        >
          <Star
            className="h-4 w-4"
            fill={isInWatchlist ? "currentColor" : "none"}
          />
        </Button>
      </div>
    </div>
  )
}