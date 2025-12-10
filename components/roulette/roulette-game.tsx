"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { RouletteWheel } from "./roulette-wheel"
import { ScheduledDraws } from "./scheduled-draws"
import { SuccessModal } from "@/components/success-modal"
import { useToast } from "@/hooks/use-toast"


// Points that can be won on the wheel (8 segments)
const PRIZE_VALUES = [100, 200, 0, 500, 50, -1, 0, 150]

const STORAGE_KEY = "raffero_active_bets"

export function RouletteGame() {
  const [userBalance, setUserBalance] = useState(500) // Starting balance
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastSegment, setLastSegment] = useState<number | null>(null)
  const [hasSpunRecently, setHasSpunRecently] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{ segment: number; value: number } | null>(null)
  const [activeBets, setActiveBets] = useState<{ drawId: number; amount: number; drawTime: Date }[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [hasScheduledDraw, setHasScheduledDraw] = useState(false)

  const wheelRef = useRef<HTMLDivElement>(null)
  const currentPrizeRef = useRef(0)
  const { toast } = useToast()

  // Load active bets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert drawTime strings back to Date objects
        const bets = parsed.map((bet: any) => ({
          ...bet,
          drawTime: new Date(bet.drawTime)
        }))
        setActiveBets(bets)
        setHasScheduledDraw(bets.length > 0)
      } catch (error) {
        console.error("Failed to parse stored bets:", error)
      }
    }
  }, [])

  // Save active bets to localStorage whenever they change
  useEffect(() => {
    if (activeBets.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBets))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [activeBets])

  const handleSpin = useCallback(() => {
    const degreesPerSegment = 360 / 8
    const previousRotation = lastSegment !== null ? lastSegment * degreesPerSegment : 0

    // Random segment (0-7)
    const randomSegment = Math.floor(Math.random() * 8)
    const targetRotation = degreesPerSegment * randomSegment

    // Add multiple full rotations for effect (4 full spins + target)
    const finalRotation = 360 * 4 + targetRotation

    currentPrizeRef.current = PRIZE_VALUES[randomSegment]
    setLastSegment(randomSegment)
    setPendingVerification(true)
    setVerificationResult(null)

    // Start animation
    setRotation(previousRotation)
    setIsAnimating(true)

    setTimeout(() => {
      setRotation(finalRotation)
    }, 100)
  }, [lastSegment])

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false)
    setHasSpunRecently(true)
  }, [])

  const handleVerify = useCallback(() => {
    if (lastSegment === null || verificationResult !== null) return

    const prizeValue = currentPrizeRef.current
    setVerificationResult({ segment: lastSegment, value: prizeValue })
    setPendingVerification(false)

    // Only add balance if verified (no public announcement)
    if (prizeValue >= 0) {
      setUserBalance((prev) => prev + prizeValue)
    }

    // Show success modal instead of toast
    setShowSuccessModal(true)

    // Reset after verification
    setHasSpunRecently(false)
  }, [lastSegment, verificationResult])

  const handleBet = useCallback(
    (drawId: number, amount: number, drawTime: Date) => {
      if (amount > userBalance) {
        toast({
          title: "⚠️ Insufficient Balance",
          description: "You don't have enough money to place this bet",
          variant: "destructive",
        })
        return
      }

      setUserBalance((prev) => prev - amount)
      setActiveBets((prev) => [...prev, { drawId, amount, drawTime }])
      setHasScheduledDraw(true)

      toast({
        title: "✅ Entered Raffle!",
        description: `You're in! The wheel will spin automatically at the scheduled time.`,
      })
    },
    [userBalance, toast]
  )

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
      {/* Demo Notice */}
      <div className="glass-card p-4 sm:p-5 md:p-6 border-cyan-500/30">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-cyan-400 mb-1 sm:mb-2">🎰 Try the Wheel Demo</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              This is a demonstration of how the app works. Spin the wheel and verify privately if you won. 
              <span className="text-foreground font-medium"> Winners are never publicly revealed</span> — only you can check your result 
              through personal verification with zero-knowledge proofs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Scheduled Draws */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ScheduledDraws 
            onBet={handleBet} 
            userBalance={userBalance}
            enteredDrawIds={activeBets.map(bet => bet.drawId)}
          />
        </div>

        {/* Roulette Wheel */}
        <div className="lg:col-span-2 flex items-center justify-center order-1 lg:order-2">
          <RouletteWheel
            userBalance={userBalance}
            rotation={rotation}
            isAnimating={isAnimating}
            onSpin={handleSpin}
            onTransitionEnd={handleTransitionEnd}
            onVerify={handleVerify}
            wheelRef={wheelRef}
            hasSpunRecently={hasSpunRecently}
            pendingVerification={pendingVerification}
            verificationResult={verificationResult}
            isDisabled={hasScheduledDraw}
          />
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        prize={verificationResult?.value ?? 0}
      />
    </div>
  )
}

