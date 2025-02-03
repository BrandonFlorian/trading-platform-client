import useSWR from 'swr'
import { useEffect } from 'react'
import { useWebSocketStore } from '@/stores/websocket-store'

export const useSmartRefresh = <T = any>(key: string, fetcher: () => Promise<T>) => {
    const { data, error, mutate } = useSWR<T>(key, fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: false
    })

    useEffect(() => {
        return useWebSocketStore.subscribe(
            (state) => state.lastActivity,
            () => mutate()
        )
    }, [mutate])

    return {
        data,
        isLoading: !error && !data,
        isError: !!error,
        mutate
    }
} 