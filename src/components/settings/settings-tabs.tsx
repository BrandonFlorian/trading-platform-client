// src/components/settings/settings-tabs.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from './general-settings'
import { CopyTradeSettingsPanel } from './copy-trade-settings-panel'
import { ExchangeSettings } from './exchange-settings'

export function SettingsTabs() {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="exchange">Exchange</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <GeneralSettings />
      </TabsContent>

      <TabsContent value="trading" className="space-y-4">
        <CopyTradeSettingsPanel />
      </TabsContent>

      <TabsContent value="exchange" className="space-y-4">
        <ExchangeSettings />
      </TabsContent>
    </Tabs>
  )
}