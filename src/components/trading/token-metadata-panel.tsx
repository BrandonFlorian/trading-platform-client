import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatBalance, formatUSD, getSolanaExplorerUrl } from '@/lib/utils'
import { API_BASE_URL } from '@/config/constants'

interface TokenMetadata {
  address: string
  name: string
  symbol: string
  metadata_uri: string
  twitter?: string
  website?: string
  market_cap: number
  total_supply: number
}

interface TokenMetadataPanelProps {
  tokenAddress: string
}

const TokenMetadataPanel = ({ tokenAddress }: TokenMetadataPanelProps) => {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenAddress) return
      
      try {
        const response = await fetch(`${API_BASE_URL}/token_metadata/${tokenAddress}`)
        if (!response.ok) throw new Error('Failed to fetch token metadata')
        
        const data = await response.json()
        setMetadata(data)
      } catch (error) {
        console.error('Error fetching token metadata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [tokenAddress])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (!metadata) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{metadata.symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(getSolanaExplorerUrl(tokenAddress), '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{metadata.name}</h3>
          <p className="text-sm text-muted-foreground">{tokenAddress}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">
              {formatUSD(metadata.market_cap)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Supply</p>
            <p className="font-medium">
              {formatBalance(metadata.total_supply)}
            </p>
          </div>
        </div>

        {(metadata.twitter || metadata.website) && (
          <div className="flex gap-2">
            {metadata.twitter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://twitter.com/${metadata.twitter}`, '_blank')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            )}
            {metadata.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(metadata.website, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Website
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TokenMetadataPanel