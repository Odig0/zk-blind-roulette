"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users, ShieldCheck } from "lucide-react"
import { RaffleStatus, RaffleType } from "./raffle-card"

interface RaffleDetailProps {
  id: string
  title: string
  type: RaffleType
  fee?: string
  prize: string
  description: string
  endsIn: string
  status: RaffleStatus
  participantCount?: number
  hasParticipated?: boolean
  isWinner?: boolean
}

export function RaffleDetail({
  title,
  type,
  fee,
  prize,
  description,
  endsIn,
  status,
  participantCount,
  hasParticipated = false,
  isWinner,
}: RaffleDetailProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "open":
        return { text: "Open", color: "text-emerald-400" }
      case "drawing":
        return { text: "Drawing in progress", color: "text-amber-400" }
      case "finished":
        return { text: "Finished", color: "text-muted-foreground" }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold flex-1">{title}</h1>
          <div>
            {type === "free" ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FREE
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-cyan-500/30 text-cyan-400">
                Fee: {fee}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Ends in: <span className="font-medium text-foreground">{endsIn}</span></span>
          </div>
          {participantCount && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span><span className="font-medium text-foreground">{participantCount}</span> participants</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Info */}
        <Card className="glass-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Prize</h2>
            <p className="text-2xl font-bold neon-gradient-text">{prize}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Conditions</h2>
            <p className="text-sm text-muted-foreground">
              {type === "free" ? (
                "No entry cost required"
              ) : (
                <>Entry fee: <span className="text-foreground font-medium">{fee}</span></>
              )}
            </p>
          </div>
        </Card>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card className="glass-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              <p className={`text-xl font-medium ${statusDisplay.color}`}>
                {statusDisplay.text}
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <ShieldCheck className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-purple-300">Private Results:</span> Only you can verify if you won. No public announcements or data leaks.
              </div>
            </div>
          </Card>

          {/* Action Area */}
          <Card className="glass-card p-6">
            {status === "open" && !hasParticipated && (
              <div className="space-y-4">
                <h3 className="font-semibold">Ready to enter?</h3>
                <Button size="lg" className="w-full">
                  Enter Raffle
                </Button>
              </div>
            )}

            {status === "open" && hasParticipated && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-sm font-medium text-emerald-400">
                    ✓ You're in! Good luck!
                  </p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Check back after the draw to verify your result
                </p>
              </div>
            )}

            {status === "drawing" && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-sm font-medium text-amber-400">
                    Drawing in progress...
                  </p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Results will be available soon
                </p>
              </div>
            )}

            {status === "finished" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Check Your Result</h3>
                {isWinner === undefined ? (
                  <>
                    <Button size="lg" className="w-full">
                      Verify Result Privately
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Only you will see if you won
                    </p>
                  </>
                ) : isWinner ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-center">
                      <p className="text-lg font-bold text-emerald-400 mb-2">
                        🎉 Congratulations!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You won this raffle!
                      </p>
                    </div>
                    <Button size="lg" className="w-full" variant="outline">
                      Claim Prize
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-sm text-muted-foreground">
                      Not a winner this time. Better luck next raffle!
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
