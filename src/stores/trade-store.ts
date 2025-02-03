// src/stores/trade-store.ts
import { create } from 'zustand'
import { TokenInfo } from '@/types'
import { DexType } from '@/types/crypto'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/config/constants'

interface TradeState {
    selectedToken: TokenInfo | null
    isLoading: boolean
    isExecutingTrade: boolean
    selectedDex: DexType
    slippage: number
    customSlippage: boolean

    setSelectedToken: (token: TokenInfo | null) => void
    setSelectedDex: (dex: DexType) => void
    setSlippage: (slippage: number) => void
    setCustomSlippage: (custom: boolean) => void
    setIsExecutingTrade: (executing: boolean) => void

    executeBuy: (amount: number) => Promise<void>
    executeSell: (amount: number) => Promise<void>
    reset: () => void
}

const DEFAULT_SLIPPAGE = 1.0

export const useTradeStore = create<TradeState>((set, get) => ({
    selectedToken: null,
    isLoading: false,
    isExecutingTrade: false,
    selectedDex: 'raydium',
    slippage: DEFAULT_SLIPPAGE,
    customSlippage: false,

    setSelectedToken: (token) => set({ selectedToken: token }),
    setSelectedDex: (dex) => set({ selectedDex: dex }),
    setSlippage: (slippage) => set({ slippage }),
    setCustomSlippage: (custom) => set({
        customSlippage: custom,
        slippage: custom ? get().slippage : DEFAULT_SLIPPAGE
    }),
    setIsExecutingTrade: (executing) => set({ isExecutingTrade: executing }),

    executeBuy: async (amount) => {
        const { selectedToken, selectedDex, slippage } = get()

        if (!selectedToken) {
            toast.error('No token selected')
            return
        }

        set({ isExecutingTrade: true })

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedDex}/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token_address: selectedToken.mint,
                    sol_quantity: amount,
                    slippage_tolerance: slippage
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Buy failed')
            }

            toast.success('Buy order executed successfully')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Buy failed')
            throw error
        } finally {
            set({ isExecutingTrade: false })
        }
    },

    executeSell: async (amount) => {
        const { selectedToken, selectedDex, slippage } = get()

        if (!selectedToken) {
            toast.error('No token selected')
            return
        }

        set({ isExecutingTrade: true })

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedDex}/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token_address: selectedToken.mint,
                    token_quantity: amount,
                    slippage_tolerance: slippage
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Sell failed')
            }

            toast.success('Sell order executed successfully')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Sell failed')
            throw error
        } finally {
            set({ isExecutingTrade: false })
        }
    },

    reset: () => set({
        selectedToken: null,
        isLoading: false,
        isExecutingTrade: false,
        selectedDex: 'raydium',
        slippage: DEFAULT_SLIPPAGE,
        customSlippage: false,
    })
}))