import { API_BASE_URL } from '@/config/constants'

export const fetchTrades = async (page: number = 1): Promise<TradeItem[]> => {
  const response = await fetch(`${API_BASE_URL}/trades?page=${page}`)
  if (!response.ok) throw new Error('Failed to fetch trades')
  return response.json()
} 