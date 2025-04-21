"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  CrosshairMode,
  type ChartOptions,
  type DeepPartial,
  type Time,
} from "lightweight-charts";
import { ArrowUp, ArrowDown } from "lucide-react";

// Time period options
type TimePeriod = "1H" | "6H" | "1D" | "1W" | "1M" | "ALL";

interface PriceChartProps {
  cardId: string;
  percentage: number;
  change?: number;
}

export default function PriceChart({
  cardId,
  percentage,
  change = 0,
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("ALL");
  const isPositive = change >= 0;

  // Generate random data based on the card ID and selected period
  const generateMockData = () => {
    // Use the card ID as a seed for consistent randomness per card
    const seed = Number.parseInt(cardId) || 1;
    const now = new Date();
    const points = [];

    // Determine number of data points and time interval based on period
    let numPoints = 0;
    let timeInterval = 0;
    const startValue = 20 + (seed % 30); // Start between 20-50%

    switch (selectedPeriod) {
      case "1H":
        numPoints = 60;
        timeInterval = 60 * 1000; // 1 minute
        break;
      case "6H":
        numPoints = 72;
        timeInterval = 5 * 60 * 1000; // 5 minutes
        break;
      case "1D":
        numPoints = 96;
        timeInterval = 15 * 60 * 1000; // 15 minutes
        break;
      case "1W":
        numPoints = 84;
        timeInterval = 2 * 60 * 60 * 1000; // 2 hours
        break;
      case "1M":
        numPoints = 90;
        timeInterval = 8 * 60 * 60 * 1000; // 8 hours
        break;
      case "ALL":
        numPoints = 120;
        timeInterval = 24 * 60 * 60 * 1000; // 1 day
        break;
    }

    // Trading patterns - create more realistic market movements
    const createTradingPattern = () => {
      // Create a more realistic trading pattern with various market behaviors
      const patterns = [];

      // Baseline volatility - different for each card
      const baseVolatility = 1.5 + (seed % 4);

      // Create some trend periods
      const trendPeriods = [];
      let remainingPoints = numPoints;

      while (remainingPoints > 0) {
        // Random period length between 5 and 20 points
        const periodLength = Math.min(
          remainingPoints,
          5 + Math.floor(Math.random() * 15)
        );

        // Trend direction and strength
        const trendStrength = (Math.random() * 2 - 1) * baseVolatility * 0.8;

        // Volatility for this period
        const periodVolatility = baseVolatility * (0.5 + Math.random());

        trendPeriods.push({
          length: periodLength,
          trend: trendStrength,
          volatility: periodVolatility,
        });

        remainingPoints -= periodLength;
      }

      // Generate the actual patterns
      for (const period of trendPeriods) {
        for (let i = 0; i < period.length; i++) {
          // Base movement is the trend
          let movement = period.trend;

          // Add volatility
          movement += (Math.random() * 2 - 1) * period.volatility;

          // Occasionally add a price spike or drop (1 in 15 chance)
          if (Math.random() < 0.067) {
            movement += (Math.random() * 2 - 1) * period.volatility * 3;
          }

          // Occasionally add a flat period (1 in 10 chance)
          if (Math.random() < 0.1) {
            movement = 0;
          }

          patterns.push(movement);
        }
      }

      return patterns;
    };

    // Generate the trading pattern for this chart
    const tradingPattern = createTradingPattern();

    // Target value (current percentage)
    const targetValue = percentage;

    // Calculate how much we need to adjust each point to reach the target
    const totalDrift = targetValue - startValue;
    const driftPerPoint = totalDrift / numPoints;

    // Generate data points with the trading pattern
    let currentValue = startValue;

    for (let i = 0; i < numPoints; i++) {
      const pointDate = new Date(
        now.getTime() - (numPoints - i) * timeInterval
      );

      // Apply the trading pattern movement
      currentValue += tradingPattern[i];

      // Apply a small drift toward the target value
      currentValue += driftPerPoint * (1 + (Math.random() * 0.4 - 0.2));

      // Ensure the value stays within reasonable bounds (5-95%)
      currentValue = Math.max(5, Math.min(95, currentValue));

      // Force the last point to be exactly the target percentage
      if (i === numPoints - 1) {
        currentValue = targetValue;
      }

      points.push({
        time: (pointDate.getTime() / 1000) as Time,
        value: Number(currentValue.toFixed(1)),
      });
    }

    return points;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { type: ColorType.Solid, color: "rgba(15, 23, 42, 0)" },
        textColor: "#9ca3af",
        fontSize: 12,
      },
      width: chartContainerRef.current.clientWidth,
      height: 150,
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
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
        visible: false,
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
          labelBackgroundColor: "#0f172a",
        },
      },
      handleScroll: false, // Disable chart scrolling
      handleScale: false, // Disable chart scaling/zooming
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    const data = generateMockData();

    const lineSeries = chart.addLineSeries({
      color: "#2dd4bf",
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
    });

    lineSeries.setData(data);

    // Add a marker at the last point
    lineSeries.setMarkers([
      {
        time: data[data.length - 1].time,
        position: "inBar",
        color: "#2dd4bf",
        shape: "circle",
        size: 1,
      },
    ]);

    // Fit content
    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    // Prevent wheel events from propagating to parent scrollable container
    const preventScroll = (e: WheelEvent) => {
      e.stopPropagation();
    };

    chartContainerRef.current.addEventListener("wheel", preventScroll, {
      passive: false,
    });

    // Cleanup
    return () => {
      chart.remove();
      window.removeEventListener("resize", handleResize);
      if (chartContainerRef.current) {
        chartContainerRef.current.removeEventListener("wheel", preventScroll);
      }
    };
  }, [cardId, percentage, selectedPeriod]);

  return (
    <div className="text-white">
      {/* Chart header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-xs text-gray-400">YES</div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-teal-400">
              {percentage}% chance
            </span>
            {change !== 0 && (
              <span
                className={`text-sm flex items-center px-2 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-teal-800/30 text-teal-400"
                    : "bg-rose-800/30 text-rose-400"
                }`}
              >
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
      <div className="grid grid-cols-6 gap-1 mt-2 my-4 rounded-md w-full text-xs">
        {(["1H", "6H", "1D", "1W", "1M", "ALL"] as TimePeriod[]).map(
          (period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-1 py-1 rounded text-center cursor-pointer ${
                selectedPeriod === period
                  ? "bg-neutral-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period}
            </button>
          )
        )}
      </div>
    </div>
  );
}
