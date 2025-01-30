import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DexType } from '@/types/crypto'

interface ExchangeSettings {
  defaultDex: DexType
  autoSlippage: boolean
  slippageTolerance: number
}

interface SettingsState {
  exchange: ExchangeSettings
  setExchangeSettings: (settings: Partial<ExchangeSettings>) => void
  resetExchangeSettings: () => void
}

const DEFAULT_EXCHANGE_SETTINGS: ExchangeSettings = {
  defaultDex: 'raydium',
  autoSlippage: true,
  slippageTolerance: 1.0,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      exchange: DEFAULT_EXCHANGE_SETTINGS,

      setExchangeSettings: (settings) =>
        set((state) => ({
          exchange: {
            ...state.exchange,
            ...settings,
          },
        })),

      resetExchangeSettings: () =>
        set(() => ({
          exchange: DEFAULT_EXCHANGE_SETTINGS,
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)