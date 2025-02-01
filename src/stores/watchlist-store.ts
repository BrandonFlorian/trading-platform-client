import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { API_BASE_URL } from '@/config/constants'
import { toast } from 'sonner'

export interface Watchlist {
  id: string
  name: string
  description?: string
  tokens: string[]
  created_at?: string
  updated_at?: string
}

export interface WatchlistToken {
  id?: string
  address: string
  symbol: string
  name: string
  balance?: string
  market_cap?: number
}

interface WatchlistState {
  watchlists: Watchlist[]
  tokens: WatchlistToken[]
  activeWatchlistId?: string
  isLoading: boolean
  error?: string

  // Watchlist operations
  createWatchlist: (watchlist: Omit<Watchlist, 'id' | 'tokens'>) => Promise<Watchlist> 
  fetchWatchlists: () => Promise<void>
  deleteWatchlist: (id: string) => Promise<void>
  setActiveWatchlist: (id: string) => void
  updateWatchlist: (watchlist: Watchlist) => Promise<void>

  // Token operations
  addToken: (token: WatchlistToken) => Promise<void>
  removeToken: (address: string) => Promise<void>
  fetchWatchlistTokens: () => Promise<void>
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlists: [],
      tokens: [],
      activeWatchlistId: undefined,
      isLoading: false,
      error: undefined,
      
      createWatchlist: async (watchlistData) => {
        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlistData)
          })

          if (!response.ok) {
            throw new Error('Failed to create watchlist')
          }

          const newWatchlist: Watchlist = await response.json()
          
          set((state) => ({
            watchlists: [...state.watchlists, newWatchlist],
            activeWatchlistId: newWatchlist.id
          }))

          return newWatchlist
        } catch (error) {
          console.error('Error creating watchlist:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      fetchWatchlists: async () => {
        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists`)
          if (!response.ok) throw new Error('Failed to fetch watchlists')
          
          const watchlists: Watchlist[] = await response.json()
          set({ watchlists })
        } catch (error) {
          console.error('Error fetching watchlists:', error)
          toast.error('Failed to fetch watchlists')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteWatchlist: async (id) => {
        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists/${id}`, {
            method: 'DELETE'
          })

          if (!response.ok) throw new Error('Failed to delete watchlist')

          set((state) => ({
            watchlists: state.watchlists.filter(w => w.id !== id),
            activeWatchlistId: state.activeWatchlistId === id ? undefined : state.activeWatchlistId
          }))
          toast.success('Watchlist deleted')
        } catch (error) {
          console.error('Error deleting watchlist:', error)
          toast.error('Failed to delete watchlist')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      setActiveWatchlist: (id) => {
        set({ activeWatchlistId: id })
        get().fetchWatchlistTokens()
      },

      updateWatchlist: async (watchlist) => {
        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists/${watchlist.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlist)
          })

          if (!response.ok) throw new Error('Failed to update watchlist')

          const updatedWatchlist = await response.json()
          set((state) => ({
            watchlists: state.watchlists.map(w => 
              w.id === updatedWatchlist.id ? updatedWatchlist : w
            )
          }))
          toast.success('Watchlist updated')
        } catch (error) {
          console.error('Error updating watchlist:', error)
          toast.error('Failed to update watchlist')
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      addToken: async (token: WatchlistToken) => {
        const activeWatchlistId = get().activeWatchlistId
        if (!activeWatchlistId) {
          throw new Error('No active watchlist selected')
        }

        try {
          set({ isLoading: true })
          
          const response = await fetch(`${API_BASE_URL}/watchlists/tokens`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              watchlist_id: activeWatchlistId,
              token_address: token.address
            })
          })

          if (!response.ok) {
            throw new Error('Failed to add token')
          }

          set((state) => ({
            tokens: [...state.tokens, token]
          }))
        } catch (error) {
          console.error('Error adding token:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeToken: async (address: string) => {
        const { activeWatchlistId } = get()
        if (!activeWatchlistId) return

        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists/${activeWatchlistId}/tokens/${address}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const text = await response.text()
            throw new Error(text || 'Failed to remove token')
          }

          set((state) => ({
            tokens: state.tokens.filter(t => t.address !== address)
          }))
        } catch (error) {
          console.error('Error removing token:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      fetchWatchlistTokens: async () => {
        const { activeWatchlistId } = get()
        if (!activeWatchlistId) return
      
        try {
          set({ isLoading: true })
          const response = await fetch(`${API_BASE_URL}/watchlists/${activeWatchlistId}`)
          if (!response.ok) throw new Error('Failed to fetch tokens')
          
          const watchlistData = await response.json()
          console.log('Raw Watchlist Data:', watchlistData)
      
          // Fetch metadata for each token
          const tokenPromises = watchlistData.tokens.map(async (tokenAddress: string) => {
            try {
              const metadataResponse = await fetch(`${API_BASE_URL}/token_metadata/${tokenAddress}`)
              if (!metadataResponse.ok) throw new Error('Failed to fetch token metadata')
              
              const metadata = await metadataResponse.json()
              return {
                address: tokenAddress,
                symbol: metadata.symbol || '',
                name: metadata.name || '',
                balance: '0',
                market_cap: metadata.market_cap,
              }
            } catch (error) {
              console.error(`Error fetching metadata for token ${tokenAddress}:`, error)
              return {
                address: tokenAddress,
                symbol: 'Unknown',
                name: 'Unknown Token',
                balance: '0',
                market_cap: 0,
              }
            }
          })
      
          const tokens = await Promise.all(tokenPromises)
          console.log('Tokens with metadata:', tokens)
          
          set({ tokens })
        } catch (error) {
          console.error('Error fetching tokens:', error)
          toast.error('Failed to fetch tokens')
          throw error
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        watchlists: state.watchlists,
        activeWatchlistId: state.activeWatchlistId
      })
    }
  )
)