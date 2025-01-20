import { useState } from "react";
import { TokenTradeProps } from "@/types/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ComponentError } from "@/components/ui/error/component-error";

const QUICK_BUY_AMOUNTS = [0.01, 0.05, 0.1, 0.5];
const QUICK_SELL_PERCENTAGES = [25, 50, 75, 100];
const MIN_SOL_AMOUNT = 0.000001;
const MAX_SOL_AMOUNT = 100;

type DexType = "pump_fun" | "raydium";

interface ValidationError {
  message: string;
  field?: string;
}

export const TradePanel = ({ token, onTrade, isLoading }: TokenTradeProps) => {
  const [customBuyAmount, setCustomBuyAmount] = useState("");
  const [customSellAmount, setCustomSellAmount] = useState("");
  const [selectedDex, setSelectedDex] = useState<DexType>("pump_fun");
  const [error, setError] = useState<ValidationError | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const tokenBalance = parseFloat(token.balance);

  const validateBuyAmount = (amount: number): ValidationError | null => {
    if (isNaN(amount)) {
      return { message: "Please enter a valid number", field: "buy" };
    }
    if (amount < MIN_SOL_AMOUNT) {
      return { message: `Minimum amount is ${MIN_SOL_AMOUNT} SOL`, field: "buy" };
    }
    if (amount > MAX_SOL_AMOUNT) {
      return { message: `Maximum amount is ${MAX_SOL_AMOUNT} SOL`, field: "buy" };
    }
    return null;
  };

  const validateSellAmount = (amount: number): ValidationError | null => {
    if (isNaN(amount)) {
      return { message: "Please enter a valid number", field: "sell" };
    }
    if (amount <= 0) {
      return { message: "Amount must be greater than 0", field: "sell" };
    }
    if (amount > tokenBalance) {
      return { message: `Insufficient balance. Max: ${tokenBalance} ${token.symbol}`, field: "sell" };
    }
    return null;
  };

  const handleQuickBuy = async (amount: number) => {
    const validationError = validateBuyAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsExecuting(true);
    try {
      await onTrade("buy", amount, selectedDex);
      toast.success(`Buy order placed for ${amount} SOL of ${token.symbol}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      setError({ message });
      toast.error(message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCustomBuy = async () => {
    const amount = parseFloat(customBuyAmount);
    const validationError = validateBuyAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    await handleQuickBuy(amount);
  };

  const handleQuickSell = async (percentage: number) => {
    const amount = (tokenBalance * percentage) / 100;
    const validationError = validateSellAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsExecuting(true);
    try {
      await onTrade("sell", amount, selectedDex);
      toast.success(`Sell order placed for ${percentage}% of ${token.symbol}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      setError({ message });
      toast.error(message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCustomSell = async () => {
    const amount = parseFloat(customSellAmount);
    const validationError = validateSellAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsExecuting(true);
    try {
      await onTrade("sell", amount, selectedDex);
      toast.success(`Sell order placed for ${amount} ${token.symbol}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      setError({ message });
      toast.error(message);
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trade {token.symbol}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error.message}
          </div>
        )}

        <div className="mb-4">
          <Select value={selectedDex} onValueChange={(value) => setSelectedDex(value as DexType)}>
            <SelectTrigger>
              <SelectValue defaultValue={selectedDex} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pump_fun">Pump.fun</SelectItem>
              <SelectItem value="raydium">Raydium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_BUY_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handleQuickBuy(amount)}
                  disabled={isExecuting}
                  className="w-full"
                >
                  {amount} SOL
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                min={MIN_SOL_AMOUNT}
                max={MAX_SOL_AMOUNT}
                step={0.001}
                value={customBuyAmount}
                onChange={(e) => {
                  setCustomBuyAmount(e.target.value);
                  setError(null);
                }}
                placeholder="Custom amount (SOL)"
                disabled={isExecuting}
                className={error?.field === "buy" ? "border-destructive" : ""}
              />
              <Button
                onClick={handleCustomBuy}
                disabled={isExecuting || !customBuyAmount}
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Buy
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SELL_PERCENTAGES.map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  onClick={() => handleQuickSell(percentage)}
                  disabled={isExecuting || tokenBalance <= 0}
                  className="w-full"
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={tokenBalance}
                step={0.000001}
                value={customSellAmount}
                onChange={(e) => {
                  setCustomSellAmount(e.target.value);
                  setError(null);
                }}
                placeholder={`Amount (${token.symbol})`}
                disabled={isExecuting}
                className={error?.field === "sell" ? "border-destructive" : ""}
              />
              <Button
                onClick={handleCustomSell}
                disabled={isExecuting || !customSellAmount}
              >
                {isExecuting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sell
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Available: {token.balance} {token.symbol}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
};