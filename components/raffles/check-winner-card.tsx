"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Trophy, X } from "lucide-react"
import { usePrivateRaffle, useRaffleData, useCanDrawWinner } from "@/hooks/usePrivateRaffle"
import { loadTicket } from "@/lib/zk-utils"
import { useToast } from "@/hooks/use-toast"
import { RaffleStatus } from "@/blockchain/contracts"

interface CheckWinnerCardProps {
  raffleId: bigint
}

export function CheckWinnerCard({ raffleId }: CheckWinnerCardProps) {
  const [hasTicket, setHasTicket] = useState(false)
  const [isWinner, setIsWinner] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const { data: raffleData, refetch } = useRaffleData(raffleId)
  const { data: canDraw } = useCanDrawWinner(raffleId)
  const { drawWinner, isPending: isDrawing } = usePrivateRaffle()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar si el usuario tiene un ticket guardado
    const ticket = loadTicket(raffleId)
    setHasTicket(!!ticket)
  }, [raffleId])

  const handleDrawWinner = async () => {
    await drawWinner(raffleId)
    
    toast({
      title: "🎲 Drawing winner...",
      description: "The winner is being selected on-chain",
    })

    // Refrescar datos después de un momento
    setTimeout(() => {
      refetch()
    }, 3000)
  }

  const handleCheckResult = () => {
    if (!raffleData || raffleData.status !== RaffleStatus.Closed) return

    setChecking(true)

    // Obtener ticket guardado
    const ticket = loadTicket(raffleId)
    if (!ticket || ticket.leafIndex === undefined) {
      toast({
        title: "No ticket found",
        description: "You don't have a ticket for this raffle",
        variant: "destructive",
      })
      setChecking(false)
      return
    }

    // Verificar si el leafIndex del usuario coincide con winnerIndex
    const userIsWinner = BigInt(ticket.leafIndex) === raffleData.winnerIndex

    setTimeout(() => {
      setIsWinner(userIsWinner)
      setChecking(false)

      if (userIsWinner) {
        toast({
          title: "🎉 CONGRATULATIONS!",
          description: "You won this raffle! You can claim your prize privately.",
        })
      } else {
        toast({
          title: "Not this time",
          description: "Better luck in the next raffle!",
        })
      }
    }, 1500)
  }

  // Si la rifa está activa y se puede sortear
  if (raffleData?.status === RaffleStatus.Active && canDraw) {
    return (
      <Card className="glass-card p-6 space-y-4">
        <h3 className="text-xl font-bold text-amber-400">Ready to Draw!</h3>
        <p className="text-sm text-muted-foreground">
          The raffle has ended. Anyone can trigger the winner selection.
        </p>
        <Button
          onClick={handleDrawWinner}
          disabled={isDrawing}
          size="lg"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          {isDrawing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Drawing...
            </>
          ) : (
            "🎲 Draw Winner Now"
          )}
        </Button>
      </Card>
    )
  }

  // Si la rifa está cerrada (ya se sorteó)
  if (raffleData?.status === RaffleStatus.Closed && hasTicket) {
    return (
      <Card className="glass-card p-6 space-y-4">
        <h3 className="text-xl font-bold neon-gradient-text">Check Your Result</h3>

        {isWinner === null ? (
          <>
            <p className="text-sm text-muted-foreground">
              The winner has been selected! Check privately if you won.
            </p>
            <Button
              onClick={handleCheckResult}
              disabled={checking}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {checking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "🔍 Check Result Privately"
              )}
            </Button>
            <p className="text-xs text-center text-purple-300">
              Only you will see if you won
            </p>
          </>
        ) : isWinner ? (
          <div className="space-y-3">
            <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/50 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-emerald-400" />
              <p className="text-2xl font-bold text-emerald-400 mb-2">
                🎉 CONGRATULATIONS!
              </p>
              <p className="text-sm text-muted-foreground">
                You won this raffle!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs text-purple-300">
                🔒 <strong>Privacy Note:</strong> To claim your prize with zero-knowledge proof,
                you'll need to generate a ZK proof. This feature is coming soon!
              </p>
            </div>
            <Button
              size="lg"
              disabled
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50"
            >
              Claim Prize (ZK Proof Required - Coming Soon)
            </Button>
          </div>
        ) : (
          <div className="p-6 rounded-lg bg-muted/30 border border-border text-center">
            <X className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Not this time
            </p>
            <p className="text-sm text-muted-foreground">
              Better luck in the next raffle!
            </p>
          </div>
        )}
      </Card>
    )
  }

  // Si no hay ticket pero está cerrada, mostrar mensaje
  if (raffleData?.status === RaffleStatus.Closed && !hasTicket) {
    return (
      <Card className="glass-card p-6 space-y-4">
        <h3 className="text-xl font-bold text-muted-foreground">Winner Selected</h3>
        <p className="text-sm text-muted-foreground">
          The winner has been selected, but you don't have a ticket for this raffle.
        </p>
        <div className="p-3 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            Winner Index: {raffleData.winnerIndex.toString()}
          </p>
        </div>
      </Card>
    )
  }

  return null
}
