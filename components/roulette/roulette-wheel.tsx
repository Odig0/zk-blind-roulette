"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface RouletteWheelProps {
  userBalance: number
  rotation: number
  isAnimating: boolean
  onSpin: () => void
  onTransitionEnd: () => void
  onVerify: () => void
  wheelRef: React.RefObject<HTMLDivElement | null>
  hasSpunRecently: boolean
  pendingVerification: boolean
  verificationResult: { segment: number; value: number } | null
  isDisabled?: boolean
}

export function RouletteWheel({
  userBalance,
  rotation,
  isAnimating,
  onSpin,
  onTransitionEnd,
  onVerify,
  wheelRef,
  hasSpunRecently,
  pendingVerification,
  verificationResult,
  isDisabled = false,
}: RouletteWheelProps) {
  const prizeEmoji = verificationResult 
    ? verificationResult.value === -1 
      ? "🎉"
      : verificationResult.value > 0
      ? "🎊"
      : "😔"
    : null

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-display neon-gradient-text">
        BALANCE: ${userBalance}
      </h2>

      <div className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[400px] mx-auto">
        <div
          ref={wheelRef}
          className="w-full aspect-square relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isAnimating ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
          onTransitionEnd={onTransitionEnd}
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
          <div className="w-0 h-0 border-l-[12px] sm:border-l-[15px] border-l-transparent border-r-[12px] sm:border-r-[15px] border-r-transparent border-t-[24px] sm:border-t-[30px] border-t-neon-pink drop-shadow-[0_0_10px_rgba(255,107,157,0.8)]" />
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button
          onClick={onSpin}
          disabled={isAnimating || pendingVerification}
          size="lg"
          className="text-xl px-12 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? "SPINNING..." : "SPIN THE WHEEL"}
        </Button>

        {/* Verification section - shown after spin completes */}
        {hasSpunRecently && !isAnimating && (
          <div className="flex flex-col gap-3 items-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm text-gray-300 italic">
              ✨ Spin completed. Verify your result:
            </p>
            <Button
              onClick={onVerify}
              disabled={verificationResult !== null}
              size="lg"
              className="text-lg px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verificationResult ? `${prizeEmoji} VERIFIED` : "VERIFY RESULT"}
            </Button>
            
            {/* Result display - only shown privately to user */}
            {verificationResult && (
              <div className="mt-4 p-6 rounded-lg border-2 border-purple-500 bg-purple-900/30 backdrop-blur-sm text-center animate-in fade-in">
                <p className="text-2xl font-bold mb-2">
                  {prizeEmoji}
                </p>
                {verificationResult.value === -1 ? (
                  <p className="text-green-400 text-lg font-bold">
                    YOU WON A SPECIAL PRIZE! 🎁
                  </p>
                ) : verificationResult.value > 0 ? (
                  <div>
                    <p className="text-yellow-400 text-lg font-bold">
                      YOU WON!
                    </p>
                    <p className="text-white mt-2">
                      +${verificationResult.value}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg font-bold">
                    You didn't win this time
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-4 italic">
                  This result is private and only you can see it
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

