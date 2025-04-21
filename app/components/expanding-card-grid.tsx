"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Bookmark,
  Gift,
  Maximize2,
  Minimize2,
  Flower,
} from "lucide-react";
import dynamic from "next/dynamic";

const PriceChart = dynamic(() => import("./price-chart"), { ssr: false });
const OrderBook = dynamic(() => import("./order-book"), { ssr: false });

type CardData = {
  id: string;
  title: string;
  iconColor?: string;
  iconText?: string;
  percentage?: number;
  options?: { name: string; percentage: number }[];
  chance?: boolean;
  winner?: string;
  volume: string;
  monthly?: boolean;
  category: string;
  change?: number;
};

export default function ExpandingCardGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Card data array
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
      title: "TikTok sale announced before May?",
      iconColor: "#1e293b",
      iconText: "6%",
      percentage: 6,
      winner: "No",
      volume: "$1m Vol.",
      category: "Technology",
      change: -12,
    },
    {
      id: "3",
      title: "Next Prime Minister of Canada after the election?",
      iconColor: "#1e293b",
      iconText: "CA",
      options: [
        { name: "Mark Carney", percentage: 73 },
        { name: "Pierre Poilievre", percentage: 28 },
        { name: "Chrystia Freeland", percentage: 1 },
        { name: "Jagmeet Singh", percentage: 1 },
        { name: "Justin Trudeau", percentage: 1 },
      ],
      volume: "$36m Vol.",
      category: "Politics",
    },
    {
      id: "4",
      title: "Fed decision in May?",
      iconColor: "#1e293b",
      iconText: "US",
      options: [
        { name: "50+ bps decrease", percentage: 4 },
        { name: "25 bps decrease", percentage: 23 },
        { name: "No change", percentage: 73 },
        { name: "25+ bps increase", percentage: 1 },
      ],
      volume: "$17m Vol.",
      monthly: true,
      category: "Economics",
    },
    {
      id: "5",
      title: "Next president of South Korea?",
      iconColor: "#1e293b",
      iconText: "KR",
      options: [
        { name: "Lee Jae-myung", percentage: 78 },
        { name: "Kim Moon-soo", percentage: 6 },
        { name: "Lee Jun-seok", percentage: 5 },
        { name: "Han Dong-hoon", percentage: 5 },
        { name: "Hong Joon-pyo", percentage: 3 },
        { name: "Oh Se-hoon", percentage: 2 },
        { name: "Yoon Suk Yeol", percentage: 1 },
        { name: "Ahn Cheol-soo", percentage: 1 },
        { name: "Na Kyung-won", percentage: 1 },
        { name: "Yoo Seong-min", percentage: 0.9 },
        { name: "Lee Nak-yon", percentage: 0.9 },
        { name: "Kim Dong-yeon", percentage: 0.9 },
        { name: "Cho Kuk", percentage: 0.9 },
        { name: "Kim Boo-kyum", percentage: 0.9 },
        { name: "Won Hee-ryong", percentage: 0.9 },
      ],
      volume: "$4m Vol.",
      category: "Politics",
    },
    {
      id: "6",
      title: "NBA Champion",
      iconColor: "#1e293b",
      iconText: "US",
      options: [
        { name: "Boston Celtics", percentage: 29 },
        { name: "Oklahoma City Thunder", percentage: 33 },
        { name: "Cleveland Cavaliers", percentage: 12 },
        { name: "Los Angeles Lakers", percentage: 8 },
        { name: "Golden State Warriors", percentage: 5 },
        { name: "Denver Nuggets", percentage: 4 },
        { name: "LA Clippers", percentage: 3 },
        { name: "New York Knicks", percentage: 2 },
        { name: "Houston Rockets", percentage: 2 },
      ],
      volume: "$59k Vol.",
      category: "Politics",
    },
    {
      id: "9",
      title: "US national Bitcoin reserve in 2025?",
      iconColor: "#1e293b",
      iconText: "53%",
      percentage: 53,
      chance: true,
      volume: "$2m Vol.",
      category: "Economics",
      change: -8,
    },
    {
      id: "7",
      title: "What price will Ethereum hit in April?",
      iconColor: "#1e293b",
      iconText: "IN",
      options: [
        { name: "$8000", percentage: 1 },
        { name: "$6000", percentage: 1 },
        { name: "$5000", percentage: 1 },
        { name: "$4000", percentage: 1 },
        { name: "$3500", percentage: 1 },
        { name: "$3000", percentage: 1 },
        { name: "$2600", percentage: 1 },
        { name: "$2400", percentage: 2 },
        { name: "$2200", percentage: 5 },
        { name: "$2000", percentage: 14 },
        { name: "$1200", percentage: 26 },
        { name: "$1000", percentage: 7 },
      ],
      volume: "$140k Vol.",
      category: "Trade",
    },
    {
      id: "8",
      title: "F1 Drivers Champion",
      iconColor: "#1e293b",
      iconText: "IN",
      options: [
        { name: "Lando Norris", percentage: 46 },
        { name: "Oscar Piastri", percentage: 24 },
        { name: "Max Verstappen", percentage: 24 },
        { name: "Lewis Hamilton", percentage: 2 },
        { name: "George Russell", percentage: 2 },
        { name: "Charles Leclerc", percentage: 2 },
        { name: "Andrea Kimi Antonelli", percentage: 1 },
        { name: "Alexander Albon", percentage: 1 },
        { name: "Esteban Ocon", percentage: 1 },
        { name: "Liam Lawson", percentage: 1 },
        { name: "Fernando Alonso", percentage: 1 },
        { name: "Pierre Gasly", percentage: 1 },
        { name: "Carlos Sainz Jr.", percentage: 1 },
        { name: "Lance Stroll", percentage: 1 },
        { name: "Oliver Bearman", percentage: 1 },
        { name: "Yuki Tsunoda", percentage: 1 },
        { name: "Nico Hülkenberg", percentage: 1 },
        { name: "Gabriel Bortoleto", percentage: 1 },
        { name: "Isack Hadjar", percentage: 1 },
        { name: "Jack Doohan", percentage: 1 },
      ],
      volume: "$549k Vol.",
      category: "Trade",
    },
    {
      id: "10",
      title: "Will Coinbase aquire Deribit?",
      iconColor: "#1e293b",
      iconText: "42%",
      percentage: 42,
      chance: true,
      volume: "$297k Vol.",
      category: "Trade",
      change: 15,
    },
    {
      id: "11",
      title: "Which company will have the best AI model on June 30?",
      iconColor: "#1e293b",
      iconText: "IN",
      options: [
        { name: "Google", percentage: 33 },
        { name: "OpenAI", percentage: 32 },
        { name: "xAI", percentage: 18 },
        { name: "Anthropic", percentage: 5 },
        { name: "DeepSeek", percentage: 5 },
        { name: "Meta", percentage: 4 },
        { name: "Alibaba", percentage: 3 },
      ],
      volume: "$5m Vol.",
      category: "Economics",
    },
    {
      id: "12",
      title: "Will ETH hard fork before June?",
      iconColor: "#1e293b",
      iconText: "95%",
      percentage: 95,
      chance: true,
      volume: "$31k Vol.",
      category: "Crypto",
      change: 52,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isExpanded = expandedId === card.id;
        const hasOptions = !!card.options;

        return (
          <motion.div
            key={card.id}
            layout
            className="bg-neutral-900 rounded-lg overflow-hidden transition-shadow hover:shadow-lg group"
            style={{
              gridRow: isExpanded ? "span 2" : "span 1",
              height: isExpanded ? "456px" : "220px",
            }}
          >
            <motion.div className="p-4 h-full flex flex-col" layout>
              {/* Card Header - Title and Icon */}
              <motion.div
                layout="position"
                className="flex items-start justify-between mb-3 min-h-[4rem]"
              >
                <div className="flex items-center gap-2 group">
                  <div
                    className={`w-10 h-10 rounded-sm flex-shrink-0 self-start mt-0.5 flex items-center justify-center bg-neutral-800 text-sm font-bold ${
                      card.percentage
                        ? card.percentage >= 50
                          ? "text-teal-400"
                          : "text-rose-400"
                        : "text-neutral-50"
                    }`}
                  >
                    {card.percentage ? (
                      card.iconText || card.category.substring(0, 2)
                    ) : (
                      <Flower size={20} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm text-pretty line-clamp-2 group-hover:line-clamp-none transition-all">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Card Content - Options or Buy Buttons */}
              <motion.div
                layout="position"
                className={`flex-grow relative ${
                  isExpanded ? "overflow-y-auto" : ""
                }`}
              >
                {hasOptions ? (
                  <div className="relative">
                    {/* Scrollable options with percentage bars */}
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
                          <span
                            className="text-sm truncate mr-2 flex-shrink-0"
                            style={{ width: "40%" }}
                          >
                            {option.name}
                          </span>

                          <div className="flex items-center">
                            <span className="text-xs font-semibold mr-2 w-8 text-right">
                              {option.percentage}%
                            </span>
                            <div className="relative" style={{ width: "60px" }}>
                              <div className="h-2.5 w-full bg-neutral-800 rounded-xs overflow-hidden relative">
                                <div
                                  className="h-full bg-teal-700/40 rounded-l-sm"
                                  style={{
                                    width: `${option.percentage}%`,
                                    borderRadius:
                                      option.percentage === 100
                                        ? "2px"
                                        : undefined,
                                  }}
                                />
                                {option.percentage < 100 && (
                                  <div
                                    className="h-full bg-rose-700/40 rounded-r-sm absolute top-0"
                                    style={{
                                      width: `${100 - option.percentage}%`,
                                      right: 0,
                                      borderRadius:
                                        option.percentage === 0
                                          ? "2px"
                                          : undefined,
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                ) : (
                  <motion.div layout="position">
                    <motion.div
                      layout="position"
                      className="grid grid-cols-2 gap-2"
                    >
                      <button className="flex justify-center items-center gap-1 py-2 bg-teal-700/30 hover:bg-teal-600/40 text-teal-400 hover:text-teal-300 rounded-md text-sm transition-colors duration-200 transform hover:scale-102 cursor-pointer">
                        Buy Yes <ArrowUpRight size={14} />
                      </button>
                      <button className="flex justify-center items-center gap-1 py-2 bg-rose-700/30 hover:bg-rose-600/40 text-rose-400 hover:text-rose-300 rounded-md text-sm transition-colors duration-200 transform hover:scale-102 cursor-pointer">
                        Buy No <ArrowDownRight size={14} />
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Expanded content - Charts and Rules */}
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
                      {/* Price chart */}
                      {card.percentage && (
                        <div className="h-[232px]">
                          <PriceChart
                            cardId={card.id}
                            percentage={card.percentage}
                            change={card.change}
                          />
                        </div>
                      )}

                      {/* Order Book */}
                      {card.percentage && (
                        <div className="my-8">
                          <OrderBook />
                        </div>
                      )}

                      {/* Rules */}
                      <div className="mt-4 text-sm text-gray-300">
                        <h3 className="font-semibold text-gray-200 mb-2">
                          Rules
                        </h3>
                        <p>
                          This market is based on the outcome of the specified
                          event as described in the title.
                        </p>
                        <p className="mt-2">
                          This market will resolve to &ldquo;Yes&rdquo; if the
                          conditions specified in the market description are met
                          before the expiration date. Otherwise, it will resolve
                          to &ldquo;No&rdquo;.
                        </p>
                        <p className="mt-2">
                          The resolution criteria are based on publicly
                          verifiable information and will be determined by the
                          market creator according to the specific rules
                          outlined for this market.
                        </p>
                        <p className="mt-2">
                          In cases where the outcome is ambiguous, the market
                          creator may consult multiple reliable sources to reach
                          a fair resolution. All decisions by the market creator
                          regarding resolution are final.
                        </p>
                        <p className="mt-2">
                          Participants should carefully review the specific
                          resolution criteria before placing bets, as edge cases
                          may be subject to interpretation based on the stated
                          rules.
                        </p>
                        <p className="mt-2">
                          The primary resolution sources will be official
                          information from relevant authorities, however a
                          consensus of credible reporting may also be used when
                          necessary.
                        </p>
                      </div>

                      {/* Bottom padding for scrollable content */}
                      <div className="h-8"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom shadow for scrollable content */}
                {isExpanded && (
                  <div className="absolute bottom-[10px] left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none"></div>
                )}
              </motion.div>

              {/* Card Footer */}
              <motion.div
                layout="position"
                className="flex justify-between items-center mt-4 text-gray-400 text-xs"
              >
                <span>
                  {card.volume} {card.monthly && "Monthly"}
                </span>
                <div className="flex gap-1">
                  <div className="hover:bg-neutral-800 p-0.5 rounded cursor-pointer">
                    <Gift size={15} />
                  </div>
                  <div className="hover:bg-neutral-800 p-0.5 rounded cursor-pointer">
                    <Bookmark size={15} />
                  </div>
                  <button
                    onClick={() => toggleExpand(card.id)}
                    className="text-gray-400 hover:text-white hover:bg-neutral-800 p-0.5 rounded transition-colors flex-shrink-0 cursor-pointer"
                    aria-label={isExpanded ? "Collapse card" : "Expand card"}
                  >
                    {isExpanded ? (
                      <Minimize2 size={15} />
                    ) : (
                      <Maximize2 size={15} />
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
