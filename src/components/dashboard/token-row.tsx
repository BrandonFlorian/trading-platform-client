import { TokenRowProps } from "@/types/ui"
import { Button } from "@/components/ui/button"
import { formatBalance } from "@/lib/utils"
import { Star } from "lucide-react"
import { useWatchlistStore } from "@/stores/watchlist-store"
import { toast } from "sonner"
import Link from "next/link"

export const TokenRow = ({ token, onClickTrade }: TokenRowProps) => {
  const { addToken, activeWatchlistId } = useWatchlistStore()

  const formattedBalance = formatBalance(parseFloat(token.balance))
  const hasMarketCap = token.market_cap > 0

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!activeWatchlistId) {
      toast.error('Please select a watchlist first')
      return
    }

    try {
      await addToken({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        balance: token.balance,
        market_cap: token.market_cap
      })
      toast.success(`${token.symbol} added to watchlist`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add token to watchlist')
    }
  }

  const handleTradeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClickTrade()
  }

  return (
    <div className="group relative">
      <Link
        href={`/trading/${token.address}`}
        className="block"
      >
        <div className="flex items-center justify-between py-2 group-hover:bg-accent/50 rounded-lg px-2 transition-colors cursor-pointer">
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
            <div className="flex items-center gap-2 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTradeClick}
                className="min-w-[80px] relative"
              >
                Trade
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToWatchlist}
                className="relative"
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}