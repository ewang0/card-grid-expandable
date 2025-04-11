"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Define types for our order data
interface OrderData {
  price: string
  shares: string
  total: string
  percentage: number
  id: string // Unique ID for animation keying
}

export default function OrderBook() {
  const [activeTab, setActiveTab] = useState<"yes" | "no">("yes")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize with expanded mock data - whole cent values only
  const [asks, setAsks] = useState<OrderData[]>([
    { price: "99¢", shares: "20230", total: "$20028", percentage: 100, id: "ask-1" },
    { price: "98¢", shares: "3575", total: "$3504", percentage: 80, id: "ask-2" },
    { price: "97¢", shares: "9845", total: "$9550", percentage: 60, id: "ask-3" },
    { price: "96¢", shares: "3423", total: "$3286", percentage: 40, id: "ask-4" },
    { price: "95¢", shares: "5000", total: "$4750", percentage: 20, id: "ask-5" },
    { price: "94¢", shares: "7231", total: "$6797", percentage: 35, id: "ask-6" },
    { price: "93¢", shares: "12451", total: "$11579", percentage: 55, id: "ask-7" },
    { price: "92¢", shares: "8320", total: "$7655", percentage: 45, id: "ask-8" },
    { price: "91¢", shares: "6125", total: "$5574", percentage: 30, id: "ask-9" },
    { price: "90¢", shares: "9751", total: "$8775", percentage: 50, id: "ask-10" },
    { price: "89¢", shares: "4281", total: "$3810", percentage: 25, id: "ask-11" },
    { price: "88¢", shares: "11325", total: "$9966", percentage: 52, id: "ask-12" },
    { price: "87¢", shares: "8750", total: "$7613", percentage: 48, id: "ask-13" },
    { price: "86¢", shares: "5431", total: "$4670", percentage: 28, id: "ask-14" },
    { price: "85¢", shares: "7826", total: "$6652", percentage: 42, id: "ask-15" },
  ])

  const [bids, setBids] = useState<OrderData[]>([
    { price: "84¢", shares: "4128", total: "$3468", percentage: 60, id: "bid-1" },
    { price: "83¢", shares: "6751", total: "$5603", percentage: 75, id: "bid-2" },
    { price: "82¢", shares: "5769", total: "$4730", percentage: 70, id: "bid-3" },
    { price: "81¢", shares: "9325", total: "$7553", percentage: 85, id: "bid-4" },
    { price: "80¢", shares: "7450", total: "$5960", percentage: 80, id: "bid-5" },
    { price: "79¢", shares: "3276", total: "$2588", percentage: 55, id: "bid-6" },
    { price: "78¢", shares: "5175", total: "$4037", percentage: 65, id: "bid-7" },
    { price: "77¢", shares: "8231", total: "$6338", percentage: 82, id: "bid-8" },
    { price: "76¢", shares: "4750", total: "$3610", percentage: 62, id: "bid-9" },
    { price: "75¢", shares: "6326", total: "$4744", percentage: 72, id: "bid-10" },
    { price: "74¢", shares: "3851", total: "$2850", percentage: 58, id: "bid-11" },
    { price: "73¢", shares: "7125", total: "$5201", percentage: 76, id: "bid-12" },
    { price: "72¢", shares: "5430", total: "$3910", percentage: 64, id: "bid-13" },
    { price: "71¢", shares: "9751", total: "$6923", percentage: 84, id: "bid-14" },
    { price: "70¢", shares: "4281", total: "$2997", percentage: 60, id: "bid-15" },
  ])

  const [lastPrice, setLastPrice] = useState("85¢")
  const [spread, setSpread] = useState("1¢")

  // Function to simulate market data changes
  const updateMarketData = useCallback(() => {
    // Update asks
    setAsks((prevAsks) => {
      const newAsks = [...prevAsks].map((ask) => {
        // Random change to shares (±10%)
        const currentShares = Number.parseFloat(ask.shares.replace(/,/g, ""))
        const sharesChange = currentShares * (0.9 + Math.random() * 0.2) // 90% to 110% of current value
        const newShares = Math.round(sharesChange).toString()

        // Calculate new total
        const price = Number.parseInt(ask.price.replace("¢", "")) / 100
        const newTotal = Math.round(sharesChange * price).toString()

        return {
          ...ask,
          shares: formatNumber(newShares),
          total: `$${formatNumber(newTotal)}`,
          percentage: Math.min(100, Math.max(10, ask.percentage + (Math.random() * 30 - 15))), // Random change to percentage
        }
      })

      // Normalize percentages relative to the highest value
      const maxTotal = Math.max(...newAsks.map((ask) => Number.parseFloat(ask.total.replace(/[$,]/g, ""))))
      return newAsks.map((ask) => ({
        ...ask,
        percentage: (Number.parseFloat(ask.total.replace(/[$,]/g, "")) / maxTotal) * 100,
      }))
    })

    // Update bids
    setBids((prevBids) => {
      const newBids = [...prevBids].map((bid) => {
        // Random change to shares (±10%)
        const currentShares = Number.parseFloat(bid.shares.replace(/,/g, ""))
        const sharesChange = currentShares * (0.9 + Math.random() * 0.2) // 90% to 110% of current value
        const newShares = Math.round(sharesChange).toString()

        // Calculate new total
        const price = Number.parseInt(bid.price.replace("¢", "")) / 100
        const newTotal = Math.round(sharesChange * price).toString()

        return {
          ...bid,
          shares: formatNumber(newShares),
          total: `$${formatNumber(newTotal)}`,
          percentage: Math.min(100, Math.max(10, bid.percentage + (Math.random() * 30 - 15))), // Random change to percentage
        }
      })

      // Normalize percentages relative to the highest value
      const maxTotal = Math.max(...newBids.map((bid) => Number.parseFloat(bid.total.replace(/[$,]/g, ""))))
      return newBids.map((bid) => ({
        ...bid,
        percentage: (Number.parseFloat(bid.total.replace(/[$,]/g, "")) / maxTotal) * 100,
      }))
    })

    // Occasionally update last price
    if (Math.random() > 0.7) {
      const askPrices = asks.map((ask) => Number.parseInt(ask.price.replace("¢", "")))
      const bidPrices = bids.map((bid) => Number.parseInt(bid.price.replace("¢", "")))
      const allPrices = [...askPrices, ...bidPrices]
      const randomIndex = Math.floor(Math.random() * allPrices.length)
      setLastPrice(`${allPrices[randomIndex]}¢`)

      // Update spread
      const minAsk = Math.min(...askPrices)
      const maxBid = Math.max(...bidPrices)
      setSpread(`${minAsk - maxBid}¢`)
    }

    // Schedule next update at a random interval
    scheduleNextUpdate()
  }, [asks, bids])

  // Helper function to format numbers with commas
  const formatNumber = (num: string) => {
    return Number.parseFloat(num).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // Function to schedule the next update at a random interval
  const scheduleNextUpdate = useCallback(() => {
    if (isCollapsed) return

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Random interval between 3000ms and 8000ms (3-8 seconds)
    const randomInterval = 3000 + Math.random() * 5000

    timeoutRef.current = setTimeout(() => {
      updateMarketData()
    }, randomInterval)
  }, [updateMarketData, isCollapsed])

  // Set up initial update and clean up on unmount
  useEffect(() => {
    scheduleNextUpdate()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [scheduleNextUpdate])

  // Handle collapse state changes
  useEffect(() => {
    if (isCollapsed) {
      // Clear timeout when collapsed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else {
      // Restart updates when expanded
      scheduleNextUpdate()
    }
  }, [isCollapsed, scheduleNextUpdate])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-800 text-slate-300">
      <div className="flex items-center justify-between p-3 cursor-pointer" onClick={toggleCollapse}>
        <h2 className="text-base font-semibold">Order Book</h2>
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "max-h-0 opacity-0" : "opacity-100",
        )}
      >
        <div className="border-b border-slate-900">
          <div className="flex">
            <button
              onClick={() => setActiveTab("yes")}
              className={cn(
                "px-4 py-1.5 text-xs font-medium relative cursor-pointer hover:text-slate-200",
                activeTab === "yes" ? "text-slate-200" : "text-slate-500",
              )}
            >
              Trade Yes
              {activeTab === "yes" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200"></div>}
            </button>
            <button
              onClick={() => setActiveTab("no")}
              className={cn(
                "px-4 py-1.5 text-xs font-medium relative cursor-pointer hover:text-slate-200",
                activeTab === "no" ? "text-slate-200" : "text-slate-500",
              )}
            >
              Trade No
              {activeTab === "no" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200"></div>}
            </button>
          </div>
        </div>

        <div className="sticky top-0 z-10 grid grid-cols-3 px-4 py-1.5 text-[10px] text-slate-400 bg-slate-900">
          <div>PRICE</div>
          <div className="text-right">SHARES</div>
          <div className="text-right">TOTAL</div>
        </div>

        <div>
          <div className="space-y-px bg-slate-900">
            {/* Asks (Sell orders) */}
            <div className="relative">
              <AnimatePresence initial={false}>
                {asks.map((ask) => (
                  <div key={ask.id} className="relative grid grid-cols-3 items-center px-4 py-1 text-xs">
                    <motion.div
                      className="absolute inset-0 bg-rose-900/30 z-0"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${ask.percentage}%`,
                        right: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        mass: 1,
                      }}
                    ></motion.div>
                    <div className="relative z-10 text-rose-400">{ask.price}</div>
                    <div className="relative z-10 text-right">{ask.shares}</div>
                    <div className="relative z-10 text-right">{ask.total}</div>
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {/* Last price and spread */}
            <div className="sticky z-10 grid grid-cols-3 bg-slate-800/80 px-4 py-1.5 text-xs">
              <div>Last: {lastPrice}</div>
              <div className="col-span-2 text-right">Spread: {spread}</div>
            </div>

            {/* Bids (Buy orders) */}
            <div className="relative">
              <AnimatePresence initial={false}>
                {bids.map((bid) => (
                  <div key={bid.id} className="relative grid grid-cols-3 items-center px-4 py-1 text-xs">
                    <motion.div
                      className="absolute inset-0 bg-teal-900/30 z-0"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${bid.percentage}%`,
                        left: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        mass: 1,
                      }}
                    ></motion.div>
                    <div className="relative z-10 text-teal-400">{bid.price}</div>
                    <div className="relative z-10 text-right">{bid.shares}</div>
                    <div className="relative z-10 text-right">{bid.total}</div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
