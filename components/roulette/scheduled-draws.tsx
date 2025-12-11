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
  onBet: (drawId: number, amount: number, drawTime: Date) => void
  userBalance: number
  enteredDrawIds?: number[]
}

// Function to generate draws for today and tomorrow (GMT-4)
function generateUpcomingDraws(): Draw[] {
  const draws: Draw[] = []
  const now = new Date()
  
  // Convert current time to GMT-4 (Bolivia timezone)
  const gmtMinus4Offset = -4 * 60 // -4 hours in minutes
  const localOffset = now.getTimezoneOffset() // Local offset in minutes
  const boliviaTime = new Date(now.getTime() + (localOffset + gmtMinus4Offset) * 60 * 1000)
  
  const currentHour = boliviaTime.getHours()
  const currentMinute = boliviaTime.getMinutes()
  
  // Daily draw times (GMT-4)
  const drawTimes = [
    { hour: 9, minute: 0, label: "09:00" },
    { hour: 12, minute: 0, label: "12:00" },
    { hour: 15, minute: 0, label: "15:00" },
  ]
  
  let drawId = 1
  
  // Helper to create a draw
  const createDraw = (date: Date, timeSlot: typeof drawTimes[0], dayOffset: number) => {
    const drawDate = new Date(date)
    drawDate.setDate(drawDate.getDate() + dayOffset)
    
    const dateStr = drawDate.toISOString().split('T')[0]
    
    return {
      id: drawId++,
      date: dateStr,
      time: timeSlot.label,
      betAmount: [10, 25, 50][Math.floor(Math.random() * 3)],
      totalBettors: Math.floor(Math.random() * 50) + 10,
      prizePool: Math.floor(Math.random() * 1000) + 500,
      status: "upcoming" as const,
    }
  }
  
  // Add today's remaining draws
  drawTimes.forEach(timeSlot => {
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    const drawTimeInMinutes = timeSlot.hour * 60 + timeSlot.minute
    
    // If draw time hasn't passed yet today
    if (drawTimeInMinutes > currentTimeInMinutes) {
      draws.push(createDraw(boliviaTime, timeSlot, 0))
    }
  })
  
  // Add all of tomorrow's draws
  drawTimes.forEach(timeSlot => {
    draws.push(createDraw(boliviaTime, timeSlot, 1))
  })
  
  // Ensure we always have at least 3 draws (if it's after last draw of today, show all tomorrow's)
  return draws.slice(0, 6)
}

const UPCOMING_DRAWS: Draw[] = generateUpcomingDraws()

export function ScheduledDraws({ onBet, userBalance, enteredDrawIds = [] }: ScheduledDrawsProps) {
  const [draws, setDraws] = useState<Draw[]>(UPCOMING_DRAWS)
  const [selectedDrawId, setSelectedDrawId] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState("")

  const selectedDraw = draws.find((d) => d.id === selectedDrawId)
  const canBet = selectedDraw && selectedDraw.status === "upcoming" && userBalance >= (selectedDraw.betAmount || 0)

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
              className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(
                draw.status
              )}`}
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

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700 mb-4">
                <div>
                  <p className="text-gray-500">Bettors</p>
                  <p className="font-semibold text-white">{draw.totalBettors}</p>
                </div>
                <div>
                  <p className="text-gray-500">Prize Pool</p>
                  <p className="font-semibold text-orange-400">${draw.prizePool}</p>
                </div>
              </div>

              {/* Enter Raffle Button or Confirmation Message */}
              {enteredDrawIds.includes(draw.id) ? (
                <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30">
                  <p className="text-sm text-cyan-300 text-center font-medium">
                    ✓ Entered • Draw executes at {draw.time} GMT-4
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    if (userBalance >= draw.betAmount) {
                      // Parse draw time to create Date object (GMT-4)
                      const [hours, minutes] = draw.time.split(':').map(Number)
                      const drawDateTime = new Date(draw.date)
                      drawDateTime.setHours(hours, minutes, 0, 0)
                      
                      onBet(draw.id, draw.betAmount, drawDateTime)
                      setDraws(
                        draws.map((d) =>
                          d.id === draw.id
                            ? { ...d, totalBettors: d.totalBettors + 1, prizePool: d.prizePool + draw.betAmount }
                            : d
                        )
                      )
                    }
                  }}
                  disabled={draw.status !== "upcoming" || userBalance < draw.betAmount}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  size="sm"
                >
                  {draw.status !== "upcoming"
                    ? "Draw Closed"
                    : userBalance < draw.betAmount
                    ? "Insufficient Balance"
                    : "Enter Raffle 🎰"}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Remove the old bet details section since we now have inline buttons */}
      </div>
    </Card>
  )
}
