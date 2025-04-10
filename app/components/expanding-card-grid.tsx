"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Bookmark, Gift, Maximize2, Minimize2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the chart component with no SSR to avoid hydration issues
const PriceChart = dynamic(() => import("./price-chart"), { ssr: false })

type CardData = {
  id: string
  title: string
  imageUrl: string
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=62%",
      percentage: 62,
      chance: true,
      volume: "$2m Vol.",
      category: "Economics",
      change: 43,
    },
    {
      id: "2",
      title: "Florida vs. Houston",
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=52%",
      percentage: 52,
      winner: "Florida",
      volume: "$314k Vol.",
      category: "Sports",
      change: 12,
    },
    {
      id: "3",
      title: "Next Prime Minister of Canada after the election?",
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=CA",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=$",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=KR",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=KR",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=Globe",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=World",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=34%",
      percentage: 34,
      chance: true,
      volume: "$501k Vol.",
      category: "Politics",
      change: -8,
    },
    {
      id: "10",
      title: "Will Trump reduce majority of tariffs before 2026?",
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=56%",
      percentage: 56,
      chance: true,
      volume: "$26k Vol.",
      category: "Trade",
      change: 15,
    },
    {
      id: "11",
      title: "How many Fed rate cuts in 2025?",
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=Fed",
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
      imageUrl: "https://placehold.co/40x40/1e293b/FFF?text=25%",
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
                <div className="flex items-center gap-2 max-w-[80%] group">
                  <img
                    src={card.imageUrl || "/placeholder.svg"}
                    alt=""
                    className="w-10 h-10 rounded-sm flex-shrink-0 object-cover self-start mt-0.5"
                  />
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
                        <motion.div key={index} layout="position" className="flex items-center justify-between mb-2 group">
                          {/* Option name */}
                          <span className="text-sm truncate mr-2 flex-shrink-0" style={{ width: "40%" }}>
                            {option.name}
                          </span>

                          <div className="flex items-center">
                            {/* Percentage (Yes) */}
                            <span className="text-xs font-semibold mr-2 w-8 text-right">{option.percentage}%</span>
                            {/* Percentage bar container */}
                            <div className=" relative" style={{ width: "64px" }}>
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
                      className="absolute inset-x-0 top-[80px] bottom-[10px] overflow-y-auto px-2"
                    >
                      {/* Price chart for cards with percentage */}
                      {card.percentage && (
                        <div className="h-[280px]">
                          <PriceChart cardId={card.id} percentage={card.percentage} change={card.change} />
                        </div>
                      )}

                      <div className="mt-4 text-sm text-gray-300">
                        <p>Additional details about this prediction market would appear here when expanded.</p>
                        <p className="mt-2">
                          Historical data, related markets, and other insights could be displayed in this expanded view.
                        </p>
                        <p className="mt-2">
                          The card has a fixed height of 2 rows in the grid, and content will scroll if it exceeds this
                          height.
                        </p>
                        <p className="mt-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
                          ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
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
