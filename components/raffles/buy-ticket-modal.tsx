"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { usePrivateRaffle, useComputeHash } from "@/hooks/usePrivateRaffle"
import { generateSecret, generateNullifier, saveTicket } from "@/lib/zk-utils"
import { formatEther } from "viem"
import { useToast } from "@/hooks/use-toast"

interface BuyTicketModalProps {
  raffleId: bigint
  ticketPrice: bigint
  onSuccess?: () => void
}

export function BuyTicketModal({ raffleId, ticketPrice, onSuccess }: BuyTicketModalProps) {
  const [step, setStep] = useState<"generate" | "computing" | "purchasing">("generate")
  const [secret, setSecret] = useState<bigint>()
  const [nullifier, setNullifier] = useState<bigint>()
  const [commitment, setCommitment] = useState<bigint>()

  const { purchaseTicket, isPending, isSuccess } = usePrivateRaffle()
  const { toast } = useToast()

  // Generar commitment usando el contrato
  const { data: computedHash, isLoading: isComputing } = useComputeHash(secret, nullifier)

  useEffect(() => {
    if (computedHash && !commitment) {
      setCommitment(computedHash as bigint)
      setStep("purchasing")
    }
  }, [computedHash, commitment])

  useEffect(() => {
    if (isSuccess && commitment && secret && nullifier) {
      // Guardar ticket en localStorage
      saveTicket(
        {
          secret,
          nullifier,
          commitment,
          raffleId,
        },
        raffleId
      )

      toast({
        title: "✅ Ticket purchased!",
        description: "Your ticket has been saved securely. Good luck!",
      })

      onSuccess?.()
    }
  }, [isSuccess, commitment, secret, nullifier, raffleId, toast, onSuccess])

  const handleGenerateAndBuy = () => {
    // Generar secret y nullifier
    const newSecret = generateSecret()
    const newNullifier = generateNullifier()

    setSecret(newSecret)
    setNullifier(newNullifier)
    setStep("computing")

    toast({
      title: "🔐 Generating commitment...",
      description: "Creating your private ticket commitment",
    })
  }

  const handlePurchase = async () => {
    if (!commitment) return

    await purchaseTicket(raffleId, commitment, ticketPrice)
  }

  return (
    <Card className="glass-card p-6 space-y-4">
      <h3 className="text-xl font-bold neon-gradient-text">Buy Private Ticket</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ticket Price</span>
          <span className="font-medium">{formatEther(ticketPrice)} ETH</span>
        </div>

        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-300">
            🔒 <strong>Privacy Guaranteed:</strong> Your ticket is completely anonymous. We generate a
            cryptographic commitment that proves you own a ticket without revealing your identity.
          </p>
        </div>

        {step === "generate" && (
          <Button
            onClick={handleGenerateAndBuy}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Generate Private Ticket
          </Button>
        )}

        {step === "computing" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-sm text-muted-foreground">Computing commitment on-chain...</p>
          </div>
        )}

        {step === "purchasing" && commitment && (
          <>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-emerald-300">
                ✓ Commitment generated successfully!
              </p>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={isPending}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Purchasing...
                </>
              ) : (
                `Purchase Ticket - ${formatEther(ticketPrice)} ETH`
              )}
            </Button>
          </>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Your secret and nullifier will be stored locally and securely
        </p>
      </div>
    </Card>
  )
}
