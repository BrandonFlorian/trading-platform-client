import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { useWebSocket } from '@/hooks/use-websocket'
import type { WebSocketMessage } from '@/types/websocket'

type WebSocketState = {
  send: (message: WebSocketMessage) => boolean
  connected: boolean
  lastActivity: number
}

export const useWebSocketStore = create(
  subscribeWithSelector<WebSocketState>(() => {
    const { sendMessage, isConnected } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    return {
      send: sendMessage,
      connected: isConnected,
      lastActivity: Date.now()
    }
  })
) 