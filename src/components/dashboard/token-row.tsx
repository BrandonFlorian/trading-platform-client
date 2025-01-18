import { TokenRowProps } from "@/types/ui";
import { Button } from "@/components/ui/button";
import { formatBalance } from "@/types/utils";

export const TokenRow = ({ token, onClickTrade }: TokenRowProps) => {
  const formattedBalance = formatBalance(parseFloat(token.balance));


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
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onClickTrade}
          className="min-w-[80px]"
        >
          Trade
        </Button>
      </div>
    </div>
  );
};
