"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Sparkles } from "lucide-react"

export function SuccessModal({ isOpen, onClose, prize }: { isOpen: boolean; onClose: () => void; prize: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    }
  }, [isOpen])

  if (!show) return null

  const isWinner = prize > 0 || prize === -1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <Card className="glass-card max-w-sm w-full p-6 relative border-2 border-cyan-500/50">
        <button
          onClick={() => {
            setShow(false)
            setTimeout(onClose, 300)
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30">
            {isWinner ? (
              <span className="text-4xl">🎉</span>
            ) : (
              <span className="text-4xl">😔</span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {isWinner ? (
                <span className="neon-gradient-text">Congratulations!</span>
              ) : (
                "Try Again"
              )}
            </h3>
            {isWinner ? (
              <p className="text-lg text-muted-foreground">
                You won <span className="text-cyan-400 font-bold">${prize === -1 ? "???" : prize}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Better luck next time!
              </p>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-start gap-2 text-left">
              <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-300 font-medium">Private Result:</span> Only you can see this. 
                Your win status is never publicly announced.
              </p>
            </div>
          </div>

          {/* Action */}
          <Button
            onClick={() => {
              setShow(false)
              setTimeout(onClose, 300)
            }}
            className="w-full"
          >
            {isWinner ? "Claim Prize" : "Spin Again"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
