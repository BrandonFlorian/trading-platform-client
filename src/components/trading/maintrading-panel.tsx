import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'
import { useSettingsStore } from '@/stores/setting-store'
import { formatBalance } from '@/lib/utils'
import { DexType } from '@/types/crypto'
import { toast } from 'sonner'

interface MainTradingPanelProps {
  tokenAddress: string
}

const QUICK_BUY_AMOUNTS = [0.1, 0.5, 1, 2]
const QUICK_SELL_PERCENTAGES = [25, 50, 75, 100]

const MainTradingPanel = ({ tokenAddress }: MainTradingPanelProps) => {
  const { serverWallet, executeBuy, executeSell, isLoading } = useWalletTrackerStore()
  const { exchange: exchangeSettings } = useSettingsStore()

  const [selectedDex, setSelectedDex] = useState<DexType>(exchangeSettings.defaultDex)
  const [slippage, setSlippage] = useState(exchangeSettings.slippageTolerance)
  const [customBuyAmount, setCustomBuyAmount] = useState('')
  const [customSellAmount, setCustomSellAmount] = useState('')

  const token = serverWallet?.tokens.find(t => t.address === tokenAddress)
  const solBalance = serverWallet?.balance || 0

  const handleQuickBuy = async (amount: number) => {
    try {
      await executeBuy(tokenAddress, amount, slippage, selectedDex)
      toast.success(`Buy order placed for ${amount} SOL`)
    } catch (error) {
      console.error('Buy failed:', error)
    }
  }

  const handleCustomBuy = async () => {
    const amount = parseFloat(customBuyAmount)
    if (isNaN(amount) || amount <= 0 || amount > solBalance) {
      toast.error(`Please enter an amount between 0 and ${solBalance} SOL`)
      return
    }
    await handleQuickBuy(amount)
  }

  const handleQuickSell = async (percentage: number) => {
    if (!token) return
    
    const amount = (parseFloat(token.balance) * percentage) / 100
    try {
      await executeSell(tokenAddress, amount, slippage, selectedDex)
      toast.success(`Sell order placed for ${percentage}% of ${token.symbol}`)
    } catch (error) {
      console.error('Sell failed:', error)
    }
  }

  const handleCustomSell = async () => {
    if (!token) return
    
    const amount = parseFloat(customSellAmount)
    if (isNaN(amount) || amount <= 0 || amount > parseFloat(token.balance)) {
      toast.error(`Please enter an amount between 0 and ${token.balance} ${token.symbol}`)
      return
    }
    try {
      await executeSell(tokenAddress, amount, slippage, selectedDex)
      toast.success(`Sell order placed for ${amount} ${token.symbol}`)
    } catch (error) {
      console.error('Sell failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trade {token?.symbol || 'Token'}</span>
          <Select value={selectedDex} onValueChange={(value: DexType) => setSelectedDex(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select DEX" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pump_fun">Pump.fun</SelectItem>
              <SelectItem value="raydium">Raydium</SelectItem>
              <SelectItem value="jupiter">Jupiter</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                  disabled={isLoading || amount > solBalance}
                >
                  {amount} SOL
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={customBuyAmount}
                onChange={(e) => setCustomBuyAmount(e.target.value)}
                placeholder="Custom amount (SOL)"
                disabled={isLoading}
              />
              <Button
                onClick={handleCustomBuy}
                disabled={isLoading || !customBuyAmount || parseFloat(customBuyAmount) <= 0}
              >
                Buy
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Available: {formatBalance(solBalance)} SOL
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_SELL_PERCENTAGES.map((percentage) => (
                <Button
                  key={percentage}
                  variant="outline"
                  onClick={() => handleQuickSell(percentage)}
                  disabled={isLoading || !token}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={customSellAmount}
                onChange={(e) => setCustomSellAmount(e.target.value)}
                placeholder={`Amount (${token?.symbol || 'Token'})`}
                disabled={isLoading}
              />
              <Button
                onClick={handleCustomSell}
                disabled={isLoading || !customSellAmount || parseFloat(customSellAmount) <= 0}
              >
                Sell
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Available: {token ? formatBalance(token.balance) : '0'} {token?.symbol || 'Token'}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            <Slider
              value={[slippage]}
              onValueChange={([value]: [number]) => setSlippage(value)}
              min={0.1}
              max={5}
              step={0.1}
              disabled={exchangeSettings.autoSlippage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MainTradingPanel