"use client"

import { useState } from 'react'
import { WalletLookupForm } from '@/components/wallet-lookup/wallet-lookup-form'
import { WalletLookupResults } from '@/components/wallet-lookup/wallet-lookup-results'
import { NotificationsPanel } from '@/components/dashboard/notification-panel'
import { WalletLookupResult } from '@/types'

export default function WalletLookupPage() {
  const [walletDetails, setWalletDetails] = useState<WalletLookupResult | null>(null)

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Wallet Lookup</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <WalletLookupForm 
            onLookupResult={(result) => setWalletDetails(result)} 
          />
          
          {walletDetails && (
            <WalletLookupResults 
              walletDetails={walletDetails} 
            />
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}