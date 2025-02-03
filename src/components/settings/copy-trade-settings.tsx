"use client"

import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settings-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { SettingsSkeletons } from '@/components/ui/loading-skeleton'

export function CopyTradeSettings() {
    const { copyTradeSettings, isLoading, fetchSettings, updateSettings } = useSettingsStore()

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    if (isLoading) {
        return <SettingsSkeletons />
    }

    return (
        <Card className="animate-in fade-in slide-in-from-bottom duration-500">
            <CardHeader>
                <CardTitle>Copy Trade Settings</CardTitle>
                <CardDescription>Configure your copy trading preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2 animate-in fade-in duration-700 delay-200">
                    <Label>Max Slippage (%)</Label>
                    <Input
                        type="number"
                        value={copyTradeSettings?.maxSlippage}
                        onChange={(e) => updateSettings({ maxSlippage: Number(e.target.value) })}
                    />
                    <p className="text-sm text-muted-foreground">Maximum allowed slippage for trades</p>
                </div>

                <div className="space-y-2 animate-in fade-in duration-700 delay-300">
                    <Label>Min Trade Size (SOL)</Label>
                    <Input
                        type="number"
                        value={copyTradeSettings?.minTradeSize}
                        onChange={(e) => updateSettings({ minTradeSize: Number(e.target.value) })}
                    />
                    <p className="text-sm text-muted-foreground">Minimum trade size to copy</p>
                </div>

                <div className="space-y-2 animate-in fade-in duration-700 delay-400">
                    <Label>Max Trade Size (SOL)</Label>
                    <Input
                        type="number"
                        value={copyTradeSettings?.maxTradeSize}
                        onChange={(e) => updateSettings({ maxTradeSize: Number(e.target.value) })}
                    />
                    <p className="text-sm text-muted-foreground">Maximum trade size to copy</p>
                </div>

                <div className="flex items-center justify-between animate-in fade-in duration-700 delay-500">
                    <div className="space-y-0.5">
                        <Label>Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified about copy trades</p>
                    </div>
                    <Switch
                        checked={copyTradeSettings?.enableNotifications}
                        onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                    />
                </div>

                <div className="flex items-center justify-between animate-in fade-in duration-700 delay-600">
                    <div className="space-y-0.5">
                        <Label>Auto Trade</Label>
                        <p className="text-sm text-muted-foreground">Automatically copy trades</p>
                    </div>
                    <Switch
                        checked={copyTradeSettings?.autoTrade}
                        onCheckedChange={(checked) => updateSettings({ autoTrade: checked })}
                    />
                </div>

                <Button
                    className="w-full animate-in fade-in duration-700 delay-700"
                    onClick={() => console.log('Save settings')}
                >
                    Save Settings
                </Button>
            </CardContent>
        </Card>
    )
} 