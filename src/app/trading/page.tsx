"use client"

import React from 'react'
import TradingLayout from '@/components/trading/trading-layout'
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store'
import CompactWalletPanel from '@/components/trading/compactwallet-panel'
import Link from 'next/link'

export default function TradingPage() {
  const { serverWallet } = useWalletTrackerStore()

  return (
    <TradingLayout>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <div className="flex items-center justify-center h-[500px]">
            <p className="text-muted-foreground">
              Select a token from your wallet to start trading
            </p>
          </div>
        </div>
        
        <div className="xl:col-span-3">
          <CompactWalletPanel />
        </div>
      </div>
    </TradingLayout>
  )
}