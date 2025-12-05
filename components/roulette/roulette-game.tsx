"use client"

import { useState, useRef, useCallback } from "react"
import { RouletteWheel } from "./roulette-wheel"
import { PrizeShop } from "./prize-shop"
import { useToast } from "@/hooks/use-toast"

interface Prize {
  id: number
  name: string
  price: number
}

const PRIZES: Prize[] = [
  { id: 1, name: "Prize 1", price: 150 },
  { id: 2, name: "Prize 2", price: 200 },
  { id: 3, name: "Prize 3", price: 500 },
  { id: 4, name: "Prize 4", price: 1000 },
]

// Points that can be won on the wheel (8 segments)
const PRIZE_VALUES = [100, 200, 0, 500, 50, -1, 0, 150]

export function RouletteGame() {
  const [totalPoints, setTotalPoints] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastSegment, setLastSegment] = useState(0)

  const wheelRef = useRef<HTMLDivElement>(null)
  const currentPrizeRef = useRef(0)
  const { toast } = useToast()

  const handleSpin = useCallback(() => {
    const degreesPerSegment = 360 / 8
    const previousRotation = lastSegment * degreesPerSegment

    // Random segment (0-7)
    const randomSegment = Math.floor(Math.random() * 8)
    const targetRotation = degreesPerSegment * randomSegment

    // Add multiple full rotations for effect (4 full spins + target)
    const finalRotation = 360 * 4 + targetRotation

    currentPrizeRef.current = PRIZE_VALUES[randomSegment]
    setLastSegment(randomSegment)

    // Start animation
    setRotation(previousRotation)
    setIsAnimating(true)

    setTimeout(() => {
      setRotation(finalRotation)
    }, 100)
  }, [lastSegment])

  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false)

    const prizeValue = currentPrizeRef.current

    if (prizeValue >= 0) {
      setTotalPoints((prev) => prev + prizeValue)
    }

    // Show result
    if (prizeValue === -1) {
      toast({
        title: "🎉 Congratulations!",
        description: "You won a special prize!!!",
      })
    } else if (prizeValue > 0) {
      toast({
        title: "🎊 You Won!",
        description: `You earned ${prizeValue} points!`,
      })
    } else {
      toast({
        title: "😔 Try Again",
        description: "Better luck next time...",
        variant: "destructive",
      })
    }
  }, [toast])

  const handlePurchase = useCallback(
    (index: number) => {
      const prize = PRIZES[index]

      if (prize.price <= totalPoints) {
        setTotalPoints((prev) => prev - prize.price)
        toast({
          title: "✅ Purchase Successful!",
          description: `You bought ${prize.name}`,
        })
      } else {
        toast({
          title: "⚠️ Insufficient Points",
          description: "You don't have enough points to buy this item",
          variant: "destructive",
        })
      }
    },
    [totalPoints, toast]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
      {/* Prize Shop */}
      <div className="lg:col-span-1">
        <PrizeShop prizes={PRIZES} totalPoints={totalPoints} onPurchase={handlePurchase} />
      </div>

      {/* Roulette Wheel */}
      <div className="lg:col-span-2 flex items-center justify-center">
        <RouletteWheel
          totalPoints={totalPoints}
          rotation={rotation}
          isAnimating={isAnimating}
          onSpin={handleSpin}
          onTransitionEnd={handleTransitionEnd}
          wheelRef={wheelRef}
        />
      </div>
    </div>
  )
}
