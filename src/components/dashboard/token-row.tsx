import { TokenRowProps } from "@/types/ui";
import { Button } from "@/components/ui/button";
import { formatBalance } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

export const TokenRow = ({ token, onClickTrade }: TokenRowProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMarketCap = token.market_cap > 0;
  const isValidBalance = !isNaN(parseFloat(token.balance));
  const formattedBalance = isValidBalance ? formatBalance(parseFloat(token.balance)) : "Invalid";
  const hasValidData = isValidBalance && token.symbol && token.name;

  const handleTrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onClickTrade();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate trade");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasValidData) {
    return (
      <div className="flex items-center justify-between py-2 px-2 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-muted-foreground">Invalid Token</span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {token.address}
            </span>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Invalid token data. This token might be unsupported or malformed.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
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
          {hasMarketCap ? (
            <div className="text-sm text-muted-foreground">
              ${formatBalance(parseFloat(token.balance) * token.market_cap)}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">No market data</div>
          )}
        </div>
        <div className="flex flex-col">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTrade}
            disabled={isLoading || !isValidBalance}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : error ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{error}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              "Trade"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};