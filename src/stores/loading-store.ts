import { create } from 'zustand'

interface LoadingState {
    loadingStates: Record<string, boolean>
    setLoading: (key: string, isLoading: boolean) => void
    isLoading: (key: string) => boolean
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
    loadingStates: {},

    setLoading: (key: string, isLoading: boolean) =>
        set(state => ({
            loadingStates: {
                ...state.loadingStates,
                [key]: isLoading
            }
        })),

    isLoading: (key: string) => get().loadingStates[key] || false
})) 