import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export const TokenSkeletons = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div>
              <Skeleton className="h-4 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export const WalletBalanceSkeletons = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-5 w-[100px]" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Skeleton className="h-4 w-[140px] mb-2" />
            <Skeleton className="h-4 w-[90px]" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-[80px] mb-2" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </div>
      ))}
    </Card>
  )
}

export const ChartSkeletons = () => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-[120px]" />
        <Skeleton className="h-5 w-[80px]" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </Card>
  )
}

export const OrderBookSkeletons = () => {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-[100px] mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`ask-${i}`} className="flex justify-between">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
        ))}
        <Skeleton className="h-6 w-full my-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`bid-${i}`} className="flex justify-between">
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export const NotificationSkeletons = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
          <Skeleton className="h-4 w-[200px] mb-2" />
          <Skeleton className="h-3 w-[100px]" />
        </Card>
      ))}
    </div>
  )
}

export const SettingsSkeletons = () => {
  return (
    <Card className="h-full animate-in fade-in duration-300">
      <CardHeader>
        <Skeleton className="h-6 w-[180px] mb-2" />
        <Skeleton className="h-4 w-[240px]" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 