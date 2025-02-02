import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import usePriceFeed from '@/hooks/use-price-feed-websocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApexOptions } from 'apexcharts';
import { usePriceStore } from '@/stores/price-store';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CandlestickChartProps {
    tokenAddress: string;
}

const CandlestickChart = ({ tokenAddress }: CandlestickChartProps) => {
    const {
        currentPrice,
        isConnected,
        candlesticks,
        setCurrentPrice,
        setCandlesticks,
        setIsConnected
    } = usePriceStore();

    const { priceData, isConnected: wsConnected, candlesticks: wsCandlesticks } = usePriceFeed(
        process.env.NEXT_PUBLIC_PRICE_FEED_URL ?? "",
        tokenAddress
    );

    useEffect(() => {
        if (priceData) {
            setCurrentPrice(priceData);
        }
        setIsConnected(wsConnected);
        setCandlesticks(wsCandlesticks);
    }, [priceData, wsConnected, wsCandlesticks, setCurrentPrice, setIsConnected, setCandlesticks]);

    const options: ApexOptions = {
        chart: {
            type: 'candlestick' as const,
            height: 400,
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                }
            }
        },
        title: {
            text: `${tokenAddress} Price Chart`,
            align: 'left'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                formatter: (value: number) => value.toFixed(6)
            }
        },
        tooltip: {
            enabled: true,
            theme: 'dark',
            x: {
                format: 'dd MMM HH:mm:ss'
            }
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#26a69a',
                    downward: '#ef5350'
                },
                wick: {
                    useFillColor: true,
                }
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-muted-foreground">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    {currentPrice && (
                        <div className="text-lg font-semibold">
                            {currentPrice.price_sol.toFixed(6)} SOL
                            {currentPrice.price_usd && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                    ${currentPrice.price_usd.toFixed(2)}
                                </span>
                            )}
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Chart
                    options={options}
                    series={[{ data: candlesticks }]}
                    type="candlestick"
                    height={400}
                />
            </CardContent>
        </Card>
    );
};

export default CandlestickChart;