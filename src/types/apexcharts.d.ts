declare module 'react-apexcharts' {
    interface Props {
        type?: 'candlestick' | 'line' | 'bar' | 'area'
        series?: Array<{ name: string; data: number[] }>
        options?: any
        width?: string | number
        height?: string | number
    }
    const ReactApexChart: React.ComponentType<Props>
    export default ReactApexChart
} 