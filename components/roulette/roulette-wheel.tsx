"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface RouletteWheelProps {
  totalPoints: number
  rotation: number
  isAnimating: boolean
  onSpin: () => void
  onTransitionEnd: () => void
  wheelRef: React.RefObject<HTMLDivElement | null>
}

export function RouletteWheel({
  totalPoints,
  rotation,
  isAnimating,
  onSpin,
  onTransitionEnd,
  wheelRef,
}: RouletteWheelProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-4xl font-display neon-gradient-text">
        Points: {totalPoints}
      </h2>

      <div className="relative">
        <div
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isAnimating ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
          onTransitionEnd={onTransitionEnd}
          className="w-[400px] h-[400px] relative"
        >
          <Image
            src="/wheel.png"
            alt="Roulette Wheel"
            width={400}
            height={400}
            className="w-full h-full"
            priority
          />
        </div>

        {/* Pointer/Arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-neon-pink drop-shadow-[0_0_10px_rgba(255,107,157,0.8)]" />
        </div>
      </div>

      <Button
        onClick={onSpin}
        disabled={isAnimating}
        size="lg"
        className="text-xl px-12 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnimating ? "SPINNING..." : "SPIN THE WHEEL"}
      </Button>
    </div>
  )
}
