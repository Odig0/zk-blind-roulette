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

  // Determinar el estado de la rifa
  const isRaffleClosed = raffleData?.status === RaffleStatus.Closed
  const canDrawWinner = Boolean(raffleData?.status === RaffleStatus.Active && canDraw)
  const isRaffleActive = Boolean(raffleData?.status === RaffleStatus.Active && !canDraw)

  // Renderizar resultado si ya verificó
  if (isWinner !== null && isRaffleClosed) {
    return (
      <Card className="glass-card p-6 space-y-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        {isWinner ? (
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

  // Siempre mostrar el componente con el botón
  return (
    <Card className="glass-card p-6 space-y-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold neon-gradient-text">
          {canDrawWinner ? "🎲 Draw Winner" : isRaffleClosed ? "🏆 Check Result" : "⏳ Check Winner"}
        </h3>
      </div>

      {/* Mensajes de estado */}
      {isRaffleActive && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-300 text-center">
            {hasTicket 
              ? "⏳ You have a ticket! Wait for the raffle to end."
              : "⏳ Raffle is active. Buy a ticket to participate!"
            }
          </p>
        </div>
      )}

      {canDrawWinner && (
        <p className="text-sm text-amber-300">
          ⚡ The raffle has ended! Click below to draw the winner.
        </p>
      )}

      {isRaffleClosed && hasTicket && (
        <p className="text-sm text-purple-300">
          🎯 The winner has been selected! Check if you won privately.
        </p>
      )}

      {isRaffleClosed && !hasTicket && (
        <p className="text-sm text-muted-foreground">
          The winner has been selected, but you don't have a ticket for this raffle.
        </p>
      )}

      {/* Botón de Draw Winner */}
      {canDrawWinner && (
        <Button
          onClick={handleDrawWinner}
          disabled={isDrawing}
          size="lg"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg h-14"
        >
          {isDrawing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Drawing Winner...
            </>
          ) : (
            "🎲 Draw Winner Now"
          )}
        </Button>
      )}

      {/* Botón de Check Result - SIEMPRE VISIBLE */}
      <Button
        onClick={handleCheckResult}
        disabled={!isRaffleClosed || checking || !hasTicket}
        size="lg"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg h-14 disabled:opacity-50"
      >
        {checking ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Checking Result...
          </>
        ) : (
          "🔍 Check If I Won"
        )}
      </Button>

      {/* Mensaje de ayuda */}
      <p className="text-xs text-center text-muted-foreground">
        {!hasTicket 
          ? "❌ You need a ticket to check results"
          : !isRaffleClosed 
            ? "⏳ Button will activate when raffle ends"
            : "🔒 Your result is completely private - only you can see it"
        }
      </p>
    </Card>
  )
}
