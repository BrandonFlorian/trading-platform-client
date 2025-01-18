"use client"

import { TokenRowProps } from "@/types/ui";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils/format";

export function TokenRow({ token, onClickTrade }: TokenRowProps) {
  const formattedBalance = formatNumber(parseFloat(token.balance));

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {token.symbol}
          </span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {token.name}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium font-mono">{formattedBalance}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClickTrade}
          className="min-w-[80px] bg-white/50 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/80 transition-all duration-200"
        >
          Trade
        </Button>
      </div>
    </div>
  );
}