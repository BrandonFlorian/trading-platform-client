// src/app/page.tsx
import React from 'react'
import { ServerWalletCard } from '@/components/dashboard/server-wallet-card'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'
import { CopyTradeSettingsPanel } from '@/components/settings/copy-trade-settings-panel'

export default function HomePage() {
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <ServerWalletCard />
          <CopyTradeSettingsPanel />
        </div>
        
        <div className="lg:col-span-4">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}