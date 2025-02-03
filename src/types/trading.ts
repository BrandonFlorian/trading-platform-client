export interface TradeItem {
  id: string
  pair: string
  side: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: Date
}

export interface Trade {
  id: string
  type: 'buy' | 'sell'
  token: string
  amount: number
  price: number
  timestamp: Date
  status: 'pending' | 'executed' | 'canceled'
} 