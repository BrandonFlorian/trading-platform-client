import React from 'react'
import { TrackedWalletsPanel } from '@/components/tracked-wallets/tracked-wallets-panel'
import { ServerWalletCard } from '@/components/dashboard/server-wallet-card'

export default function TrackedWalletsPage() {
  return (
    <div className="space-y-6">
      <ServerWalletCard displayName="Connected Wallet" />
      <TrackedWalletsPanel />
    </div>
  )
}
