"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Bookmark, Gift, Maximize2, Minimize2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the chart component with no SSR to avoid hydration issues
const PriceChart = dynamic(() => import("./price-chart"), { ssr: false })
const OrderBook = dynamic(() => import("./order-book"), { ssr: false })

type CardData = {
  id: string
  title: string
  iconColor?: string
  iconText?: string
  percentage?: number
  options?: { name: string; percentage: number }[]
  chance?: boolean
  winner?: string
  volume: string
  monthly?: boolean
  category: string
  change?: number
}

export default function ExpandingCardGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Remove this line: const [hoveredOption, setHoveredOption] = useState<{ id: string; isYes: boolean } | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Generate more options for demonstration
  const generateMoreOptions = (baseOptions: { name: string; percentage: number }[], total = 10) => {
    const result = [...baseOptions]

    // Add more options with fixed percentages instead of random ones
    while (result.length < total) {
      const lastIndex = result.length
      result.push({
        name: `Additional Option ${lastIndex + 1}`,
        percentage: 10 + (lastIndex % 20), // Deterministic value instead of random
      })
    }

    return result
  }

  const cards: CardData[] = [
    {
      id: "1",
      title: "US recession in 2025?",
      iconColor: "#1e293b",
      iconText: "62%",
      percentage: 62,
      chance: true,
      volume: "$2m Vol.",
      category: "Economics",
      change: 43,
    },
    {
      id: "2",
      title: "Florida vs. Houston",
      iconColor: "#1e293b",
      iconText: "52%",
      percentage: 52,
      winner: "Florida",
      volume: "$314k Vol.",
      category: "Sports",
      change: 12,
    },
    {
      id: "3",
      title: "Next Prime Minister of Canada after the election?",
      iconColor: "#1e293b",
      iconText: "CA",
      options: generateMoreOptions(
        [
          { name: "Mark Carney", percentage: 73 },
          { name: "Pierre Poilievre", percentage: 28 },
          { name: "Chrystia Freeland", percentage: 1 },
        ],
        12,
      ),
      volume: "$36m Vol.",
      category: "Politics",
    },
    {
      id: "4",
      title: "Fed decision in May?",
      iconColor: "#1e293b",
      iconText: "FE",
      options: generateMoreOptions(
        [
          { name: "50+ bps decrease", percentage: 4 },
          { name: "25 bps decrease", percentage: 23 },
          { name: "No change", percentage: 73 },
        ],
        8,
      ),
      volume: "$17m Vol.",
      monthly: true,
      category: "Economics",
    },
    {
      id: "5",
      title: "Next president of South Korea?",
      iconColor: "#1e293b",
      iconText: "KR",
      options: generateMoreOptions(
        [
          { name: "Lee Jae-myung", percentage: 79 },
          { name: "Kim Moon-soo", percentage: 4 },
          { name: "Lee Jun-seok", percentage: 4 },
        ],
        15,
      ),
      volume: "$4m Vol.",
      category: "Politics",
    },
    {
      id: "6",
      title: "What will Trump say during Netanyahu events today?",
      iconColor: "#1e293b",
      iconText: "TR",
      options: generateMoreOptions(
        [
          { name: "Israel 7+ times", percentage: 100 },
          { name: "Gaza 10+ times", percentage: 10 },
          { name: "Tariff 10+ times", percentage: 100 },
        ],
        9,
      ),
      volume: "$59k Vol.",
      category: "Politics",
    },
    {
      id: "7",
      title: "Which country will Trump lower tariffs on first?",
      iconColor: "#1e293b",
      iconText: "TR",
      options: generateMoreOptions(
        [
          { name: "Israel", percentage: 56 },
          { name: "Japan", percentage: 12 },
          { name: "Argentina", percentage: 11 },
        ],
        10,
      ),
      volume: "$140k Vol.",
      category: "Trade",
    },
    {
      id: "8",
      title: "Which countries will Trump reduce tariffs on before June?",
      iconColor: "#1e293b",
      iconText: "TR",
      options: generateMoreOptions(
        [
          { name: "Japan", percentage: 90 },
          { name: "Vietnam", percentage: 88 },
          { name: "Taiwan", percentage: 88 },
        ],
        11,
      ),
      volume: "$549k Vol.",
      category: "Trade",
    },
    {
      id: "9",
      title: "Elon out of Trump administration before 2026?",
      iconColor: "#1e293b",
      iconText: "34%",
      percentage: 34,
      chance: true,
      volume: "$501k Vol.",
      category: "Politics",
      change: -8,
    },
    {
      id: "10",
      title: "Will Trump reduce majority of tariffs before 2026?",
      iconColor: "#1e293b",
      iconText: "56%",
      percentage: 56,
      chance: true,
      volume: "$26k Vol.",
      category: "Trade",
      change: 15,
    },
    {
      id: "11",
      title: "How many Fed rate cuts in 2025?",
      iconColor: "#1e293b",
      iconText: "FE",
      options: generateMoreOptions(
        [
          { name: "0", percentage: 7 },
          { name: "1 (25 bps)", percentage: 10 },
          { name: "2 (50 bps)", percentage: 12 },
        ],
        14,
      ),
      volume: "$5m Vol.",
      category: "Economics",
    },
    {
      id: "12",
      title: "Russia x Ukraine ceasefire before July?",
      iconColor: "#1e293b",
      iconText: "25%",
      percentage: 25,
      chance: true,
      volume: "$6m Vol.",
      category: "Geopolitics",
      change: -3,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isExpanded = expandedId === card.id
        const hasOptions = !!card.options

        return (
          <motion.div
            key={card.id}
            layout
            className="bg-slate-900 rounded-lg overflow-hidden transition-shadow hover:shadow-lg group"
            style={{
              gridRow: isExpanded ? "span 2" : "span 1",
              height: isExpanded ? "456px" : "220px", // Increased height to fully span 2 rows
            }}
          >
            <motion.div className="p-4 h-full flex flex-col" layout>
              {/* Header */}
              <motion.div layout="position" className="flex items-start justify-between mb-3 min-h-[4rem]">
                <div className="flex items-center gap-2 group">
                  <div
                    className="w-10 h-10 rounded-sm flex-shrink-0 self-start mt-0.5 flex items-center justify-center bg-slate-800 text-sm font-bold"
                  >
                    {card.iconText || card.category.substring(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div layout="position" className={`flex-grow relative ${isExpanded ? "overflow-y-auto" : ""}`}>
                {hasOptions ? (
                  <div className="relative">
                    {/* Scrollable options container with different max-height based on expanded state */}
                    <div
                      className={`overflow-y-auto pr-1 transition-all duration-300 ${
                        isExpanded ? "max-h-[300px]" : "max-h-[80px]"
                      }`}
                    >
                      {card.options?.map((option, index) => (
                        <motion.div
                          key={index}
                          layout="position"
                          className="flex items-center justify-between mb-2 group"
                        >
                          {/* Option name */}
                          <span className="text-sm truncate mr-2 flex-shrink-0" style={{ width: "40%" }}>
                            {option.name}
                          </span>

                          <div className="flex items-center">
                            {/* Percentage (Yes) */}
                            <span className="text-xs font-semibold mr-2 w-8 text-right">{option.percentage}%</span>
                            {/* Percentage bar container */}
                            <div className=" relative" style={{ width: "60px" }}>
                              {/* Bar */}
                              <div className="h-2.5 w-full bg-slate-800 rounded-xs overflow-hidden relative">
                                {/* Yes portion */}
                                <div
                                  className="h-full bg-teal-700/40 rounded-l-sm"
                                  style={{
                                    width: `${option.percentage}%`,
                                    borderRadius: option.percentage === 100 ? "2px" : undefined,
                                  }}
                                />
                                {/* No portion */}
                                {option.percentage < 100 && (
                                  <div
                                    className="h-full bg-rose-700/40 rounded-r-sm absolute top-0"
                                    style={{
                                      width: `${100 - option.percentage}%`,
                                      right: 0,
                                      borderRadius: option.percentage === 0 ? "2px" : undefined,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Fade effect at the bottom when not expanded */}
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                ) : (
                  <motion.div layout="position">
                    {/* Buy buttons */}
                    <motion.div layout="position" className="grid grid-cols-2 gap-2">
                      <button className="flex justify-center items-center gap-1 py-2 bg-teal-700/30 hover:bg-teal-600/40 text-teal-400 hover:text-teal-300 rounded-md text-sm transition-colors duration-200">
                        Buy Yes <ArrowUpRight size={14} />
                      </button>
                      <button className="flex justify-center items-center gap-1 py-2 bg-rose-700/30 hover:bg-rose-600/40 text-rose-400 hover:text-rose-300 rounded-md text-sm transition-colors duration-200">
                        Buy No <ArrowDownRight size={14} />
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Expanded content */}
                <AnimatePresence mode="wait">
                  {isExpanded && !hasOptions && (
                    <motion.div
                      key="expanded-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-x-0 top-[72px] bottom-[10px] overflow-y-auto"
                    >
                      {/* Price chart for cards with percentage */}
                      {card.percentage && (
                        <div className="h-[232px]">
                          <PriceChart cardId={card.id} percentage={card.percentage} change={card.change} />
                        </div>
                      )}

                      {/* Order Book - added below the price chart */}
                      {card.percentage && (
                        <div className="my-8">
                          <OrderBook />
                        </div>
                      )}

                      <div className="mt-4 text-sm text-gray-300">
                        <h3 className="font-semibold text-gray-200 mb-2">Rules</h3>
                        <p>
                          On February 17, the White House stated that Musk is a Senior Advisor to the President and an
                          employee in the White House Office.
                        </p>
                        <p className="mt-2">
                          This market will resolve to &ldquo;Yes&rdquo; if it is announced that Elon Musk will leave the Trump
                          Administration, or otherwise ceases to be a member of administration by June 30, 2025, 11:59
                          PM ET.
                        </p>
                        <p className="mt-2">
                          An announcement of Musk&apos;s resignation/removal before this market&apos;s end date will immediately
                          resolve this market to &ldquo;Yes&rdquo;, regardless of when the announced resignation/removal goes into
                          effect.
                        </p>
                        <p className="mt-2">
                          The Trump administration includes individuals formally appointed by Donald Trump to roles
                          within the U.S. federal government, such as Cabinet members, Executive Office staff, senior
                          policy advisors, ambassadors, or White House staff whose appointments are publicly announced
                          by official government channels.
                        </p>
                        <p className="mt-2">
                          Changes to Musk&apos;s position within the Trump administration (e.g. if he is named administrator
                          of DOGE), will not qualify for a &ldquo;Yes&rdquo; resolution.
                        </p>
                        <p className="mt-2">
                          The primary resolution source will be official information from the Trump administration,
                          however a consensus of credible reporting may also be used.
                        </p>
                      </div>

                      {/* Add padding at the bottom to ensure content doesn't get cut off by the shadow */}
                      <div className="h-8"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shadow at the bottom of scrollable content - keep this outside the AnimatePresence */}
                {isExpanded && (
                  <div className="absolute bottom-[10px] left-0 right-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                )}
              </motion.div>

              {/* Footer - now after expanded content */}
              <motion.div layout="position" className="flex justify-between items-center mt-4 text-gray-400 text-xs">
                <span>
                  {card.volume} {card.monthly && "Monthly"}
                </span>
                <div className="flex gap-1">
                  <div className="hover:bg-slate-800 p-0.5 rounded cursor-pointer">
                    <Gift size={15} />
                  </div>
                  <div className="hover:bg-slate-800 p-0.5 rounded cursor-pointer">
                    <Bookmark size={15} />
                  </div>
                  <button
                    onClick={() => toggleExpand(card.id)}
                    className="text-gray-400 hover:text-white hover:bg-slate-800 p-0.5 rounded transition-colors flex-shrink-0 cursor-pointer"
                    aria-label={isExpanded ? "Collapse card" : "Expand card"}
                  >
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
