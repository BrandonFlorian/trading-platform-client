"use client"

import { useState } from 'react';
import { TokenTradeProps, TradeType } from "@/types/ui";
import { DexType } from "@/types/crypto";
import { formatNumber } from "@/lib/utils/format";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TradeDialogProps extends Omit<TokenTradeProps, 'onTrade'> {
  isOpen: boolean;
  onClose: () => void;
  onTrade: (type: TradeType, amount: number, dex: DexType) => Promise<void>;
}

const QUICK_BUY_AMOUNTS = [0.01, 0.05, 0.1, 0.5];
const QUICK_SELL_PERCENTAGES = [25, 50, 75, 100];
const MIN_SOL_AMOUNT = 0.000001;
const MAX_SOL_AMOUNT = 100;

export function TradeDialog({
  token,
  isLoading,
  isOpen,
  onClose,
  onTrade
}: TradeDialogProps) {
  const [selectedDex, setSelectedDex] = useState<DexType>("pump_fun");
  const [customAmount, setCustomAmount] = useState("");
  const tokenBalance = parseFloat(token.balance);

  const handleTrade = async (type: TradeType, amount: number) => {
    try {
      await onTrade(type, amount, selectedDex);
      const message = type === 'buy' 
        ? `Bought ${amount} SOL worth of ${token.symbol}`
        : `Sold ${amount} ${token.symbol}`;
      toast.success(message);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleQuickSell = async (percentage: number) => {
    const amount = (tokenBalance * percentage) / 100;
    await handleTrade('sell', amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Trade {token.symbol}</span>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select DEX</label>
            <Select
              value={selectedDex}
              onValueChange={(value) => setSelectedDex(value as DexType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pump_fun">Pump.fun</SelectItem>
                <SelectItem value="raydium">Raydium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="buy">
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
                    onClick={() => handleTrade('buy', amount)}
                    disabled={isLoading}
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
                  step="0.001"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Custom amount (SOL)"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleTrade('buy', Number(customAmount))}
                  disabled={isLoading || !customAmount || Number(customAmount) <= 0}
                >
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
                    disabled={isLoading || tokenBalance <= 0}
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
                  step="0.000001"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`Amount (${token.symbol})`}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleTrade('sell', Number(customAmount))}
                  disabled={isLoading || !customAmount || Number(customAmount) <= 0}
                >
                  Sell
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                Available: {formatNumber(tokenBalance)} {token.symbol}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}