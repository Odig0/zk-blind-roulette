"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"
import Link from "next/link"

export type RaffleStatus = "open" | "drawing" | "finished"
export type RaffleType = "free" | "paid"

interface RaffleCardProps {
  id: string
  title: string
  type: RaffleType
  fee?: string
  prize: string
  endsIn: string
  status: RaffleStatus
  participantCount?: number
  hasParticipated?: boolean
}

export function RaffleCard({
  id,
  title,
  type,
  fee,
  prize,
  endsIn,
  status,
  participantCount,
  hasParticipated = false,
}: RaffleCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "open":
        return <span className="text-xs text-emerald-400">Open</span>
      case "drawing":
        return <span className="text-xs text-amber-400">Drawing</span>
      case "finished":
        return <span className="text-xs text-muted-foreground">Finished</span>
    }
  }

  const getActionButton = () => {
    if (status === "finished") {
      return (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/raffles/${id}`}>Did You Win?</Link>
        </Button>
      )
    }
    if (hasParticipated) {
      return (
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/raffles/${id}`}>View Raffle</Link>
        </Button>
      )
    }
    return (
      <Button size="sm" className="w-full" asChild>
        <Link href={`/raffles/${id}`}>Enter</Link>
      </Button>
    )
  }

  return (
    <Card className="glass-card p-3 sm:p-4 hover:border-cyan-500/50 transition-all duration-300 group">
      <div className="space-y-2 sm:space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Type Badge */}
        <div>
          {type === "free" ? (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border border-cyan-500/30 text-cyan-400">
              Fee: {fee}
            </span>
          )}
        </div>

        {/* Prize */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Prize</p>
          <p className="text-sm font-medium text-foreground">{prize}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{endsIn}</span>
          </div>
          {participantCount && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{participantCount}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {getActionButton()}
        </div>
      </div>
    </Card>
  )
}
