import { create } from "zustand"

interface PriceData {
  price_sol: number
  timestamp: number
}

interface CandlestickData {
  x: Date
  y: [number, number, number, number] // open, high, low, close
}

interface PriceStore {
  currentPrice: PriceData | null
  isConnected: boolean
  candlesticks: CandlestickData[]
  setCurrentPrice: (price: PriceData | null) => void
  setIsConnected: (isConnected: boolean) => void
  setCandlesticks: (candlesticks: CandlestickData[]) => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  currentPrice: null,
  isConnected: false,
  candlesticks: [],
  setCurrentPrice: (price) => set({ currentPrice: price }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setCandlesticks: (candlesticks) => set({ candlesticks }),
}))

