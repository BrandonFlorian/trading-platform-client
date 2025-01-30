import { TokenRowProps } from "@/types/ui"
import { Button } from "@/components/ui/button"
import { formatBalance } from "@/lib/utils"
import { Star } from "lucide-react"
import { useWatchlistStore } from "@/stores/watchlist-store"
import { toast } from "sonner"
import { useWalletTrackerStore } from "@/stores/wallet-tracker-store"

export const TokenRow = ({ token, onClickTrade }: TokenRowProps) => {
  const { addToken } = useWatchlistStore()
  const { copyTradeSettings } = useWalletTrackerStore()
  
  const formattedBalance = formatBalance(parseFloat(token.balance));
  const hasMarketCap = token.market_cap > 0;

  const handleAddToWatchlist = async () => {
    try {
      // Log the exact token details being added
      console.log('Token details for watchlist:', {
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        balance: token.balance,
        market_cap: token.market_cap
      })

      // Ensure we have an active watchlist from copy trade settings
      if (!copyTradeSettings?.tracked_wallet_id) {
        toast.error('No active watchlist found')
        return
      }

      await addToken({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        balance: token.balance,
        market_cap: token.market_cap
      })
      
      toast.success(`${token.symbol} added to watchlist`)
    } catch (error) {
      console.error('Error adding token to watchlist:', error)
      toast.error('Failed to add token to watchlist', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return (
    <div className="flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{token.symbol}</span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {token.name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
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
          onClick={onClickTrade}
          className="min-w-[80px]"
        >
          Trade
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddToWatchlist}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}