"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, DollarSign } from "lucide-react"

interface Draw {
  id: number
  date: string
  time: string
  betAmount: number
  totalBettors: number
  prizePool: number
  status: "upcoming" | "active" | "closed" | "drawn"
}

interface ScheduledDrawsProps {
  onBet: (drawId: number, amount: number) => void
  userBalance: number
}

const UPCOMING_DRAWS: Draw[] = [
  {
    id: 1,
    date: "2025-12-09",
    time: "14:00",
    betAmount: 10,
    totalBettors: 45,
    prizePool: 450,
    status: "upcoming",
  },
  {
    id: 2,
    date: "2025-12-09",
    time: "18:00",
    betAmount: 25,
    totalBettors: 32,
    prizePool: 800,
    status: "upcoming",
  },
  {
    id: 3,
    date: "2025-12-10",
    time: "12:00",
    betAmount: 50,
    totalBettors: 18,
    prizePool: 900,
    status: "upcoming",
  },
  {
    id: 4,
    date: "2025-12-10",
    time: "20:00",
    betAmount: 100,
    totalBettors: 12,
    prizePool: 1200,
    status: "upcoming",
  },
]

export function ScheduledDraws({ onBet, userBalance }: ScheduledDrawsProps) {
  const [draws, setDraws] = useState<Draw[]>(UPCOMING_DRAWS)
  const [selectedDrawId, setSelectedDrawId] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState("")

  const selectedDraw = draws.find((d) => d.id === selectedDrawId)
  const canBet = selectedDraw && selectedDraw.status === "upcoming" && userBalance >= (selectedDraw.betAmount || 0)

  const handlePlaceBet = () => {
    if (!selectedDraw || !canBet) return

    const amount = selectedDraw.betAmount
    onBet(selectedDraw.id, amount)

    // Update draw info
    setDraws(
      draws.map((d) =>
        d.id === selectedDrawId
          ? { ...d, totalBettors: d.totalBettors + 1, prizePool: d.prizePool + amount }
          : d
      )
    )

    setSelectedDrawId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "border-blue-500/50 bg-blue-900/20"
      case "active":
        return "border-green-500/50 bg-green-900/20"
      case "closed":
        return "border-yellow-500/50 bg-yellow-900/20"
      case "drawn":
        return "border-purple-500/50 bg-purple-900/20"
      default:
        return "border-gray-500/50"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming":
        return "🔜 Upcoming"
      case "active":
        return "🔴 Active"
      case "closed":
        return "⏹️ Closed"
      case "drawn":
        return "✅ Drawn"
      default:
        return status
    }
  }

  return (
    <Card className="glass-card h-full p-4 sm:p-5 md:p-6">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-semibold">Scheduled Draws</h2>
        </div>

        {/* Balance Display */}
        <div className="p-3 sm:p-4 rounded-lg bg-background/50 border border-border">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Your Balance:</p>
          <p className="text-xl sm:text-2xl font-bold neon-gradient-text">${userBalance}</p>
        </div>

        {/* Draws List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {draws.map((draw) => (
            <div
              key={draw.id}
              onClick={() => setSelectedDrawId(draw.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getStatusColor(
                draw.status
              )} ${selectedDrawId === draw.id ? "ring-2 ring-cyan-500" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-lg">{getStatusLabel(draw.status)}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(draw.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {draw.time}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-400 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {draw.betAmount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
                <div>
                  <p className="text-gray-500">Bettors</p>
                  <p className="font-semibold text-white">{draw.totalBettors}</p>
                </div>
                <div>
                  <p className="text-gray-500">Prize Pool</p>
                  <p className="font-semibold text-orange-400">${draw.prizePool}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bet Details */}
        {selectedDraw && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-bold mb-4">Place Bet</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <p className="text-sm text-gray-400">Draw Date & Time</p>
                <p className="font-bold text-white">
                  {new Date(selectedDraw.date).toLocaleDateString()} at {selectedDraw.time}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <p className="text-sm text-gray-400">Bet Amount</p>
                <p className="font-bold text-orange-400 text-xl">${selectedDraw.betAmount}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                <p className="text-sm text-gray-400">Current Prize Pool</p>
                <p className="font-bold text-green-400 text-xl">${selectedDraw.prizePool}</p>
              </div>

              <Button
                onClick={handlePlaceBet}
                disabled={!canBet}
                size="lg"
                className="w-full text-lg font-bold mt-4"
              >
                {!canBet
                  ? selectedDraw.status !== "upcoming"
                    ? "Draw Closed"
                    : "Insufficient Balance"
                  : `Place Bet - $${selectedDraw.betAmount}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
