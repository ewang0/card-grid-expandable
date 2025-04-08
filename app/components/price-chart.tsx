"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, LineStyle, CrosshairMode, ChartOptions, DeepPartial, Time } from "lightweight-charts"
import { ArrowUp, ArrowDown } from "lucide-react"

// Time period options
type TimePeriod = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL"

interface PriceChartProps {
  cardId: string
  percentage: number
  change?: number
}

export default function PriceChart({ cardId, percentage, change = 0 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("ALL")
  const isPositive = change >= 0

  // Generate random data based on the card ID and selected period
  const generateMockData = () => {
    // Use the card ID as a seed for consistent randomness per card
    const seed = Number.parseInt(cardId) || 1
    const now = new Date()
    const points = []

    // Determine number of data points and time interval based on period
    let numPoints = 0
    let timeInterval = 0
    let startValue = 20 + (seed % 20) // Start between 20-40%

    switch (selectedPeriod) {
      case "1H":
        numPoints = 60
        timeInterval = 60 * 1000 // 1 minute
        break
      case "6H":
        numPoints = 72
        timeInterval = 5 * 60 * 1000 // 5 minutes
        break
      case "1D":
        numPoints = 96
        timeInterval = 15 * 60 * 1000 // 15 minutes
        break
      case "1W":
        numPoints = 84
        timeInterval = 2 * 60 * 60 * 1000 // 2 hours
        break
      case "1M":
        numPoints = 90
        timeInterval = 8 * 60 * 60 * 1000 // 8 hours
        break
      case "ALL":
        numPoints = 100
        timeInterval = 24 * 60 * 60 * 1000 // 1 day
        break
    }

    // Generate data points
    for (let i = numPoints - 1; i >= 0; i--) {
      const pointDate = new Date(now.getTime() - i * timeInterval)

      // Create a pseudo-random walk that ends at the current percentage
      let randomWalk = 0
      if (i > 0) {
        // More volatility in the middle, trending toward final value
        const volatility = 2 + (seed % 3) // Different volatility per card
        const trend = (percentage - startValue) / numPoints
        randomWalk = Math.sin(i * seed) * volatility + trend * (numPoints - i)
      }

      const value = i === 0 ? percentage : Math.max(5, Math.min(95, startValue + randomWalk))

      points.push({
        time: pointDate.getTime() / 1000 as Time,
        value: Number(value.toFixed(1)) ,
      })

      // Update the start value to create a continuous line
      if (i < numPoints - 1) {
        startValue = points[points.length - 1].value
      }
    }

    return points
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { type: ColorType.Solid, color: "rgba(19, 23, 34, 0)" },
        textColor: "#9ca3af",
        fontSize: 12,
      },
      width: chartContainerRef.current.clientWidth,
      height: 200,
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0.5)",
          style: LineStyle.Dotted,
        },
        horzLines: {
          color: "rgba(255, 255, 255, 0.1)",
          style: LineStyle.Dotted,
          visible: true,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: "rgba(224, 227, 235, 0.1)",
          style: LineStyle.Solid,
        },
        horzLine: {
          width: 1,
          color: "rgba(224, 227, 235, 0.1)",
          style: LineStyle.Solid,
          labelBackgroundColor: "#13171e",
        },
      },
      handleScroll: false, // Disable chart scrolling
      handleScale: false, // Disable chart scaling/zooming
    }

    const chart = createChart(chartContainerRef.current, chartOptions)
    const data = generateMockData()

    const lineSeries = chart.addLineSeries({
      color: "#3b82f6",
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      priceLineVisible: false,
      // Format tooltip values as percentages
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 1,
      },
    })

    lineSeries.setData(data)

    // Add a marker at the last point
    lineSeries.setMarkers([
      {
        time: data[data.length - 1].time,
        position: "inBar",
        color: "#3b82f6",
        shape: "circle",
        size: 1,
      },
    ])

    // Fit content
    chart.timeScale().fitContent()

    window.addEventListener("resize", handleResize)

    // Prevent wheel events from propagating to parent scrollable container
    const preventScroll = (e: WheelEvent) => {
      e.stopPropagation()
    }

    chartContainerRef.current.addEventListener("wheel", preventScroll, { passive: false })

    // Cleanup
    return () => {
      chart.remove()
      window.removeEventListener("resize", handleResize)
      if (chartContainerRef.current) {
        chartContainerRef.current.removeEventListener("wheel", preventScroll)
      }
    }
  }, [cardId, percentage, selectedPeriod])

  return (
    <div className="text-white">
      {/* Chart header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-xs text-gray-400">YES</div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{percentage}% chance</span>
            {change !== 0 && (
              <span className={`text-sm flex items-center px-2 py-0.5 rounded-full ${isPositive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>
        {/* Removed branding */}
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ touchAction: "none" }} // Prevent touch scrolling on mobile
      />

      {/* Time period selector - Made to span full width */}
      <div className="grid grid-cols-6 gap-1 mt-2 mb-4 w-full text-xs">
        {(["1H", "6H", "1D", "1W", "1M", "ALL"] as TimePeriod[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-1 py-1 rounded text-center ${
              selectedPeriod === period ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}
