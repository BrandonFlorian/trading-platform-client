// src/app/tracked-wallets/page.tsx
"use client"

import React from 'react'
import { TrackedWalletsPanel } from '@/components/tracked-wallets/tracked-wallets-panel'
import { ServerWalletCard } from '@/components/dashboard/server-wallet-card'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'
import { Card } from '@/components/ui/card'

export default function TrackedWalletsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tracked Wallets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full">
          <TrackedWalletsPanel />
        </div>

        <div className="w-full bg-card">
          {/* Add debug wrapper */}
          <Card className="w-full">
            <ServerWalletCard displayName="Connected Wallet" />
          </Card>
        </div>

        <div className="w-full">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}