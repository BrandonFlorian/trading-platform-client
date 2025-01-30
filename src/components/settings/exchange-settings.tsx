"use client"

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export function ExchangeSettings() {
  const [defaultDex, setDefaultDex] = useState<string>('jupiter')
  const [autoSlippage, setAutoSlippage] = useState(true)
  const [slippageTolerance, setSlippageTolerance] = useState('1.0')

  const handleSaveSettings = () => {
    // TODO: Implement settings save
    toast.success('Exchange settings saved')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange Settings</CardTitle>
        <CardDescription>
          Configure your default trading preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Default DEX</Label>
          <Select value={defaultDex} onValueChange={setDefaultDex}>
            <SelectTrigger>
              <SelectValue placeholder="Select default DEX" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jupiter">Jupiter</SelectItem>
              <SelectItem value="raydium">Raydium</SelectItem>
              <SelectItem value="pump_fun">Pump.fun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Slippage</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust slippage tolerance based on market conditions
              </p>
            </div>
            <Switch
              checked={autoSlippage}
              onCheckedChange={setAutoSlippage}
            />
          </div>

          {!autoSlippage && (
            <div className="space-y-2">
              <Label>Slippage Tolerance (%)</Label>
              <Input
                type="number"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(e.target.value)}
                step="0.1"
                min="0.1"
                max="50"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}