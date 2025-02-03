import { WalletBalanceSkeletons } from "@/components/ui/loading-skeleton"
import { useWalletTrackerStore } from '@/stores/wallet-tracker-store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Token } from '@/types/crypto';

interface WalletUpdate {
    balance: number
    equity: number
    tokens: Token[]
}

const WalletTracker = () => {
    const { isLoading, serverWallet } = useWalletTrackerStore();

    if (isLoading) {
        return <WalletBalanceSkeletons />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Wallet Balance
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span>{serverWallet?.balance || '0.00'} USDT</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Equity</span>
                        <span>{serverWallet?.balance || '0.00'} USDT</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 