"\"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { toast } from "react-toastify"

interface PriceData {
  price_sol: number
  timestamp: number
}

interface CandlestickData {
  x: Date
  y: [number, number, number, number] // open, high, low, close
}

interface UsePriceFeedProps {
  baseUrl: string
  tokenAddress: string | undefined
}

const usePriceFeed = ({ baseUrl, tokenAddress }: UsePriceFeedProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [candlesticks, setCandlesticks] = useState<CandlestickData[]>([])
  const websocketRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!tokenAddress) return
    if (websocketRef.current?.readyState === WebSocket.OPEN) return

    try {
      let wsUrl: string
      if (baseUrl.startsWith("ws://") || baseUrl.startsWith("wss://")) {
        wsUrl = `${baseUrl}/ws?token=${tokenAddress}`
      } else {
        const url = new URL("/ws", baseUrl)
        url.searchParams.set("token", tokenAddress)
        wsUrl = url.toString().replace(/^http/, "ws")
      }

      console.log("Connecting to WebSocket:", wsUrl)
      websocketRef.current = new WebSocket(wsUrl)

      websocketRef.current.onopen = () => {
        console.log("WebSocket connection opened")
        setIsConnected(true)
      }

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setPriceData(data)
        updateCandlesticks(data)
      }

      websocketRef.current.onclose = () => {
        setIsConnected(false)
        handleReconnect()
      }

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        toast.error("WebSocket error occurred")
        handleReconnect()
      }
    } catch (error) {
      console.error("Error creating WebSocket:", error)
      toast.error("Failed to create WebSocket connection")
      handleReconnect()
    }
  }, [baseUrl, tokenAddress])

  const handleReconnect = useCallback(() => {
    setTimeout(() => {
      connect()
    }, 5000) // Retry after 5 seconds
  }, [connect])

  const updateCandlesticks = useCallback((data: PriceData) => {
    setCandlesticks((prevCandlesticks) => {
      // Implement your candlestick update logic here
      // This is a simplified example
      const newCandle: CandlestickData = {
        x: new Date(data.timestamp * 1000),
        y: [data.price_sol, data.price_sol, data.price_sol, data.price_sol],
      }
      return [...prevCandlesticks, newCandle].slice(-100) // Keep last 100 candlesticks
    })
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [connect])

  return { isConnected, priceData, candlesticks }
}

export default usePriceFeed

