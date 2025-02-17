"use client"

import { useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import usePriceFeed from "@/hooks/use-price-feed-websocket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApexOptions } from "apexcharts"
import { usePriceStore } from "@/stores/price-store"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface CandlestickChartProps {
  tokenAddress: string
}

const CandlestickChart = ({ tokenAddress }: CandlestickChartProps) => {
  const { currentPrice, isConnected, candlesticks, setCurrentPrice, setCandlesticks, setIsConnected } = usePriceStore()

  const priceFeedData = usePriceFeed({
    baseUrl: process.env.NEXT_PUBLIC_PRICE_FEED_URL || "",
    tokenAddress,
  })

  const prevPriceDataRef = useRef(priceFeedData.priceData)
  const prevIsConnectedRef = useRef(priceFeedData.isConnected)
  const prevCandlesticksRef = useRef(priceFeedData.candlesticks)

  const updateStoreData = useCallback(() => {
    if (priceFeedData.priceData !== prevPriceDataRef.current) {
      if (priceFeedData.priceData !== null) {
        setCurrentPrice(priceFeedData.priceData)
      }
      prevPriceDataRef.current = priceFeedData.priceData
    }

    if (priceFeedData.isConnected !== prevIsConnectedRef.current) {
      setIsConnected(priceFeedData.isConnected)
      prevIsConnectedRef.current = priceFeedData.isConnected
    }

    if (priceFeedData.candlesticks !== prevCandlesticksRef.current) {
      setCandlesticks(priceFeedData.candlesticks)
      prevCandlesticksRef.current = priceFeedData.candlesticks
    }
  }, [priceFeedData, setCurrentPrice, setIsConnected, setCandlesticks])

  useEffect(() => {
    updateStoreData()
  }, [updateStoreData])

  const options: ApexOptions = {
    // Your chart options here
  }

  const series = [
    {
      data: candlesticks,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <Chart options={options} series={series} type="candlestick" height={350} />
        ) : (
          <p>Connecting to price feed...</p>
        )}
      </CardContent>
    </Card>
  )
}

export default CandlestickChart

