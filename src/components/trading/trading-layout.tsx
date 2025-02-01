"use client"

// src/components/trading/trading-layout.tsx
import React from 'react'
import { Card } from '@/components/ui/card'
import { useParams } from 'next/navigation'

interface TradingLayoutProps {
  children?: React.ReactNode
  tokenAddress?: string
}

const TradingLayout = ({ children, tokenAddress }: TradingLayoutProps) => {
  const params = useParams()
  const currentTokenAddress = tokenAddress || params.tokenAddress as string

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Trading</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {children}
      </div>
    </div>
  )
}

export default TradingLayout