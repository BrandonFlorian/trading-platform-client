// src/types/market.ts
export interface OrderBookEntry {
    price: number
    size: number
    total: number
}

export interface OrderBookProps {
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
    isLoading: boolean
    depth?: number
}

export interface MarketData {
    price: number
    volume24h: number
    high24h: number
    low24h: number
    change24h: number
}