import React, { useState } from "react";
import { TokenTradeProps } from "@/types/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DexType } from "@/types/crypto";

const QUICK_BUY_AMOUNTS = [0.01, 0.05, 0.1, 0.5];
const QUICK_SELL_PERCENTAGES = [25, 50, 75, 100];
const MIN_SOL_AMOUNT = 0.000001;
const MAX_SOL_AMOUNT = 100;

const DEX_OPTIONS = [
  {
    value: "jupiter",
    label: "Jupiter",
    icon: "/dexes/jupiter.svg"
  },
  {
    value: "raydium",
    label: "Raydium",
    icon: "/dexes/raydium.svg"
  },
  {
    value: "pump_fun",
    label: "Pump.fun",
    icon: "/dexes/pump.svg"
  }
];

export const TradePanel = ({ token, onTrade, isLoading }: TokenTradeProps) => {
  const [customBuyAmount, setCustomBuyAmount] = useState("");
  const [customSellAmount, setCustomSellAmount] = useState("");
  const [selectedDex, setSelectedDex] = useState<DexType>("jupiter");
  const tokenBalance = parseFloat(token.balance);

  const handleQuickBuy = async (amount: number) => {
    try {
      await onTrade("buy", amount, selectedDex);
      toast.success(`Buy order placed for ${amount} SOL of ${token.symbol}`);
    } catch (error) {
      console.error("Buy failed:", error);
    }
  };

  const handleCustomBuy = async () => {
    const amount = parseFloat(customBuyAmount);
    if (isNaN(amount) || amount < MIN_SOL_AMOUNT || amount > MAX_SOL_AMOUNT) {
      toast.error(
        `Please enter an amount between ${MIN_SOL_AMOUNT} and ${MAX_SOL_AMOUNT} SOL`
      );
      return;
    }
    await handleQuickBuy(amount);
  };

  const handleCustomSell = async () => {
    const amount = parseFloat(customSellAmount);
    if (isNaN(amount) || amount <= 0 || amount > tokenBalance) {
      toast.error(
        `Please enter an amount between 0 and ${tokenBalance} ${token.symbol}`
      );
      return;
    }
    try {
      await onTrade("sell", amount, selectedDex);
      toast.success(`Sell order placed for ${amount} ${token.symbol}`);
    } catch (error) {
      console.error("Sell failed:", error);
    }
  };

  const handleQuickSell = async (percentage: number) => {
    const amount = (tokenBalance * percentage) / 100;
    try {
      await onTrade("sell", amount, selectedDex);
      toast.success(`Sell order placed for ${percentage}% of ${token.symbol}`);
    } catch (error) {
      console.error("Sell failed:", error);
    }
  };

  const getTokenIcon = () => {
    try {
      return `/icons/${token.symbol.toLowerCase()}.svg`;
    } catch {
      return null;
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTokenIcon() && (
              <div className="relative w-6 h-6">
                <Image
                  src={getTokenIcon()!}
                  alt={token.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
            )}
            <span>Trade {token.symbol}</span>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">Select DEX</label>
          <Select
            value={selectedDex}
            onValueChange={(value) => setSelectedDex(value as DexType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEX_OPTIONS.map((dex) => (
                <SelectItem
                  key={dex.value}
                  value={dex.value}
                  className="flex items-center gap-2"
                >
                  <div className="relative w-4 h-4">
                    <Image
                      src={dex.icon}
                      alt={dex.label}
                      width={16}
                      height={16}
                    />
                  </div>
                  {dex.label}
                </SelectItem>
              ))}
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
                  disabled={isLoading}
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
                onChange={(e) => setCustomBuyAmount(e.target.value)}
                placeholder="Custom amount (SOL)"
                disabled={isLoading}
              />
              <Button
                onClick={handleCustomBuy}
                disabled={
                  isLoading ||
                  !customBuyAmount ||
                  parseFloat(customBuyAmount) <= 0
                }
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
                onChange={(e) => setCustomSellAmount(e.target.value)}
                placeholder={`Amount (${token.symbol})`}
                disabled={isLoading}
              />
              <Button
                onClick={handleCustomSell}
                disabled={
                  isLoading ||
                  !customSellAmount ||
                  parseFloat(customSellAmount) <= 0
                }
              >
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