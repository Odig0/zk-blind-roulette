"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"
import { usePrivateRaffle, useComputeHash } from "@/hooks/usePrivateRaffle"
import { generateSecret, generateNullifier, saveTicket } from "@/lib/zk-utils"
import { formatEther } from "viem"
import { useToast } from "@/hooks/use-toast"

interface BuyTicketModalProps {
  raffleId: bigint
  ticketPrice: bigint
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function BuyTicketModal({ raffleId, ticketPrice, isOpen, onClose, onSuccess }: BuyTicketModalProps) {
  const [step, setStep] = useState<"generate" | "computing" | "purchasing" | "success">("generate")
  const [secret, setSecret] = useState<bigint>()
  const [nullifier, setNullifier] = useState<bigint>()
  const [commitment, setCommitment] = useState<bigint>()

  const { purchaseTicket, isPending, isSuccess } = usePrivateRaffle()
  const { toast } = useToast()

  // Generar commitment usando el contrato
  const { data: computedHash, isLoading: isComputing } = useComputeHash(secret, nullifier)

  // Validar datos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      console.log("🎫 BuyTicketModal opened with:", {
        raffleId: raffleId.toString(),
        ticketPrice: ticketPrice.toString(),
        ticketPriceETH: formatEther(ticketPrice),
      })

      if (!ticketPrice || ticketPrice === BigInt(0)) {
        toast({
          title: "⚠️ Warning",
          description: "Ticket price is 0 ETH. This raffle may not be properly configured.",
          variant: "destructive",
        })
      }
    }
  }, [isOpen, raffleId, ticketPrice, toast])

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

      // Cambiar a estado de éxito
      setStep("success")
      onSuccess?.()
    }
  }, [isSuccess, commitment, secret, nullifier, raffleId, toast, onSuccess])

  const handleClose = () => {
    onClose()
    // Resetear estado después de cerrar
    setTimeout(() => {
      setStep("generate")
      setSecret(undefined)
      setNullifier(undefined)
      setCommitment(undefined)
    }, 300)
  }

  const handleGenerateAndBuy = () => {
    // Generar secret y nullifier
    const newSecret = generateSecret()
    const newNullifier = generateNullifier()

    console.log("🔐 Generated credentials:", {
      secret: newSecret.toString(),
      nullifier: newNullifier.toString(),
    })

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

    // Validar que el precio del ticket sea válido
    if (!ticketPrice || ticketPrice === BigInt(0)) {
      toast({
        title: "❌ Invalid ticket price",
        description: "The raffle ticket price is 0 or invalid. Please contact the raffle creator.",
        variant: "destructive",
      })
      return
    }

    console.log("💳 Attempting purchase:", {
      raffleId: raffleId.toString(),
      commitment: commitment.toString(),
      ticketPrice: ticketPrice.toString(),
      ticketPriceETH: formatEther(ticketPrice),
    })

    try {
      await purchaseTicket(raffleId, commitment, ticketPrice)
    } catch (error) {
      console.error("❌ Purchase ticket error:", error)
      toast({
        title: "❌ Purchase failed",
        description: error instanceof Error ? error.message : "Transaction failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="glass-card w-full sm:max-w-md sm:m-4 rounded-t-3xl sm:rounded-2xl relative animate-slide-up">
        <div className="p-5 sm:p-6 space-y-4">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <h3 className="text-2xl sm:text-xl font-bold neon-gradient-text pr-8">Buy Private Ticket</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-background/50 border border-border">
              <span className="text-sm text-muted-foreground">Ticket Price</span>
              <span className="text-xl font-bold neon-gradient-text">{formatEther(ticketPrice)} ETH</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <p className="text-sm text-purple-200 leading-relaxed">
                🔒 <strong className="text-purple-100">Privacy Guaranteed:</strong> Your ticket is completely anonymous. We generate a
                cryptographic commitment that proves you own a ticket without revealing your identity.
              </p>
            </div>

            {step === "generate" && (
              <Button
                onClick={handleGenerateAndBuy}
                size="lg"
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50"
              >
                Generate Private Ticket
              </Button>
            )}

            {step === "computing" && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                <p className="text-base text-center text-muted-foreground">Computing commitment on-chain...</p>
              </div>
            )}

            {step === "purchasing" && commitment && (
              <>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-200">
                    ✓ Commitment generated successfully!
                  </p>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={isPending}
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Purchasing...
                    </>
                  ) : (
                    `Purchase Ticket - ${formatEther(ticketPrice)} ETH`
                  )}
                </Button>
              </>
            )}

            {step === "success" && (
              <>
                <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                  <div className="text-center space-y-2">
                    <div className="text-5xl">🎉</div>
                    <p className="text-lg font-bold text-emerald-100">Ticket Purchased!</p>
                    <p className="text-sm text-emerald-200">
                      Your private ticket has been saved securely
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleClose}
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/50"
                >
                  Done
                </Button>
              </>
            )}

            {step !== "success" && (
              <p className="text-xs text-center text-muted-foreground pt-2">
                Your secret and nullifier will be stored locally and securely
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
