// src/app/wallet-lookup/page.tsx
"use client"

import React, { useState } from 'react'
import { WalletLookupForm } from '@/components/wallet-lookup/wallet-lookup-form'
import { WalletLookupResults } from '@/components/wallet-lookup/wallet-lookup-results'
import { WalletLookupResult } from '@/types'

export default function WalletLookupPage() {
  const [lookupResult, setLookupResult] = useState<WalletLookupResult | null>(null)

  const handleLookupResult = (result: WalletLookupResult) => {
    setLookupResult(result)
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Wallet Lookup</h1>
      <div className="space-y-6">
        <WalletLookupForm onLookupResult={handleLookupResult} />
        {lookupResult && <WalletLookupResults walletDetails={lookupResult} />}
      </div>
    </div>
  )
}