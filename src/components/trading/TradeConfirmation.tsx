import { useWebSocketStore } from '@/stores/websocket-store'
import { Trade } from '@/types/trading'

export const useTradeConfirm = () => {
    const { send } = useWebSocketStore()

    return (trade: Trade) => {
        send({
            type: 'CONFIRM_TRADE',
            id: trade.id,
            amount: trade.amount,
            token: trade.token
        })
    }
} 