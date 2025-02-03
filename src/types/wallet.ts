export interface WalletUpdate {
    address: string
    totalEquity: number
    equity: number
    availableBalance: number
    tokens: {
        symbol: string
        balance: number
        value: number
    }[]
    positions: {
        symbol: string
        size: number
        entryPrice: number
        markPrice: number
        pnl: number
    }[]
} 