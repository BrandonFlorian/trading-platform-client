// src/app/tracked-wallets/page.tsx
"use client"

import React from 'react'
import { TrackedWalletsPanel } from '@/components/tracked-wallets/tracked-wallets-panel'
import ServerWalletCard from '@/components/dashboard/server-wallet-card'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'

export default function TrackedWalletsPage() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      {/* Centered Header */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
        <h1 className="text-3xl font-bold">Tracked Wallets</h1>
        <p className="text-muted-foreground mt-2">Monitor and analyze wallet activity</p>
      </div>

      {/* Three Equal Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <TrackedWalletsPanel />
        </div>
        <div className="animate-in fade-in zoom-in duration-700 delay-150">
          <ServerWalletCard displayName="Connected Wallet" />
        </div>
        <div className="animate-in fade-in slide-in-from-right duration-700">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}