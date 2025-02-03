import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const usePredictivePrefetch = () => {
    const router = useRouter()

    useEffect(() => {
        const handleMouseOver = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const link = target.closest('a')

            if (link) {
                const href = link.getAttribute('href')
                if (href && router.route !== href) {
                    router.prefetch(href)
                }
            }
        }

        document.addEventListener('mouseover', handleMouseOver)
        return () => document.removeEventListener('mouseover', handleMouseOver)
    }, [router])
} 