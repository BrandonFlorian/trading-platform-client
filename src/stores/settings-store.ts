import { create } from 'zustand'

interface CopyTradeSettings {
    maxSlippage: number
    minTradeSize: number
    maxTradeSize: number
    enableNotifications: boolean
    autoTrade: boolean
}

interface SettingsState {
    copyTradeSettings: CopyTradeSettings | null
    isLoading: boolean
    error: string | null
    updateSettings: (settings: Partial<CopyTradeSettings>) => void
    fetchSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
    copyTradeSettings: null,
    isLoading: false,
    error: null,

    updateSettings: (settings) => {
        set((state) => ({
            copyTradeSettings: {
                ...state.copyTradeSettings,
                ...settings,
            } as CopyTradeSettings,
        }))
    },

    fetchSettings: async () => {
        set({ isLoading: true })
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            set({
                copyTradeSettings: {
                    maxSlippage: 1,
                    minTradeSize: 0.1,
                    maxTradeSize: 10,
                    enableNotifications: true,
                    autoTrade: false,
                },
                isLoading: false,
            })
        } catch (error) {
            set({ error: 'Failed to load settings', isLoading: false })
        }
    },
})) 