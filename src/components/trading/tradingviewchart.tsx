"use client"

import React, { useEffect, useRef, useState } from 'react'
import { 
  createChart, 
  ColorType
} from 'lightweight-charts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { API_BASE_URL } from '@/config/constants'

interface TradingViewChartProps {
  tokenAddress: string
}

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ tokenAddress }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const isDarkTheme = theme === 'dark'

    // Create chart
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { 
          type: ColorType.Solid, 
          color: isDarkTheme ? '#1a1a1a' : '#ffffff' 
        },
        textColor: isDarkTheme ? '#d1d5db' : '#374151',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    })

    // Add candlestick series
    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350'
    })

    // Mock data
    const mockData: CandlestickData[] = [
      { 
        time: '2024-01-01', 
        open: 100, 
        high: 110, 
        low: 90, 
        close: 105 
      },
      { 
        time: '2024-01-02', 
        open: 105, 
        high: 115, 
        low: 95, 
        close: 110 
      }
    ]

    seriesRef.current.setData(mockData)
    chartRef.current.timeScale().fitContent()

    // Resize handler
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        })
      }
    }

    window.addEventListener('resize', handleResize)

    setIsLoading(false)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [theme, tokenAddress])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Price Chart</span>
          {isLoading && <span className="text-sm text-muted-foreground">Loading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={chartContainerRef} 
          className="w-full h-[500px]" 
        />
      </CardContent>
    </Card>
  )
}

export default TradingViewChart